import { NodeMeshFactory } from "./NodeMeshFactory";
import { NodeMesh } from "./NodeMesh";
import { CascadeStrategyProvider } from "../Cascade/CascadeStrategyProvider";
import { ICascadeStrategy } from "../Cascade/ICascadeStrategy";
import { BlockFactory } from "../Block/BlockFactory";
import { SpawnData } from "../Cascade/SpawnData";
import { BlockMediator } from "../Block/BlockMediator";
import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { GridEvents } from "./GridEvents";
import { GridNode } from "./GridNode";
import { SwapVO } from "./VOs/SwapVO";
import { BreakVO } from "./VOs/BreakVO";
import { CascadeVO } from "./VOs/CascadeVO";
import { ScoreEvents } from "../Score/ScoreEvents";

export class GridController extends EventHandler{
    private _gridNodes: NodeMesh;
    private _cascadeStrategyProvider: CascadeStrategyProvider;
    private _blockFactory: BlockFactory;
    
    constructor(injectedBlockFactory: BlockFactory, injectedEventHub: EventHub, injectedNodeMesh: NodeMesh, injectedCascadeStrategyProvider: CascadeStrategyProvider){
        super(injectedEventHub);
        this.addEventListener(GridEvents.InitialiseGridEvent, this.onInitialiseEvent.bind(this));
        this.addEventListener(GridEvents.ShowBlockSelectedEvent, this.onShowBlockSelectedEvent.bind(this));
        this.addEventListener(GridEvents.ShowBlockUnselectedEvent, this.onShowBlockUnselectedEvent.bind(this));
        this.addEventListener(GridEvents.ShowBlockSwapAnimationEvent, this.onShowBlockSwapAnimationEvent.bind(this));
        this.addEventListener(GridEvents.BreakAndCascadeBlocksEvent, this.onBreakBlocksEvent.bind(this));
        this.addEventListener(GridEvents.RefillGridEvent, this.onRefillGridEvent.bind(this));
        this._blockFactory = injectedBlockFactory;
        //TODO: move instantiation of NodeMeshFactory into bootstrap and 'inject'
        this._gridNodes = injectedNodeMesh;
        this._cascadeStrategyProvider = injectedCascadeStrategyProvider;
    }

    private onInitialiseEvent(): void{
        console.log("GridController.onInitialiseEvent()::: Initialise event received")
        this.fillGrid();
    }

    private fillGrid(): void{
        this.spawnBlocks();
    }

    private spawnBlocks(): void{
        let cascadeStrategy: ICascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
        if(cascadeStrategy.shouldSpawnBlock){
            let spawnData: SpawnData = cascadeStrategy.nextSpawn;
            let block:BlockMediator = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
            block.blockMoveComplete = this.onBlockSpawnCompleteCallback.bind(this);
            spawnData.destination.assignBlock(block);
            block.spawnBlockTo(spawnData.destination.gridCoordinate);
        }else{
            this.dispatchEvent(GridEvents.InitialiseGridCompleteEvent);
            console.log("GridController.spawnBlocks()::: Our grid is full");
        }
    }

    private onBlockSpawnCompleteCallback(completedBlock: BlockMediator) : void{
        completedBlock.blockMoveComplete = undefined;
        this.spawnBlocks();
    }

    private onBreakBlocksEvent(message?: any): void{
        console.log("GridController.onBreakBlocksEvent():::");
        let breakDelay: number = 400;
        let breakVos:BreakVO[] = message;
        this.dispatchEvent(ScoreEvents.UpdateScoreForBlocksBrokenEvent, breakVos);
        for(let i:number = 0; i<breakVos.length;i++){
            let coords: Phaser.Point[] = breakVos[i].coords.toArray();
            for(let j:number = 0;j<coords.length;j++){
                let coord: Phaser.Point = coords[j];
                let nodeAtCoord: GridNode = this._gridNodes.nodes.getValue(coord);
                let blockMed: BlockMediator = nodeAtCoord.getCurrentBlock();
                nodeAtCoord.releaseBlock();
                console.log(`BreakNode: ${nodeAtCoord.gridCoordinate}`);
                let firstCoordOfFinalVO = breakVos[breakVos.length-1].coords.toArray()[0];
                if(coord == firstCoordOfFinalVO){
                    //We came up with a better way to do this in cascadeBlocks() ("this", being figure out when we're done)
                    blockMed.blockDestroyComplete = this.onFinalBlockDestroyComplete.bind(this)
                }
                blockMed.showBlockDestroyAnimation(i*breakDelay);
            }
        }
    }

    private onFinalBlockDestroyComplete(blockMediator: BlockMediator):void {
        blockMediator.blockDestroyComplete = undefined;
        console.log("GridController.onFinalBlockDestroyComplete()");
        this.cascadeBlocks();
    }

    private cascadeBlocks(): void{
        console.log("GridController.cascadeBlocks()")
        let cascadeStrategy: ICascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
        let blocksToCascade: CascadeVO[] = cascadeStrategy.blocksToCascade;
        if(blocksToCascade.length>0){
            for(let i:number = 0; i<blocksToCascade.length;i++){
                let cascadeVO: CascadeVO = blocksToCascade[i];
                let cascadingBlock:BlockMediator = cascadeVO.cascadingBlock;
                //ALL nodes cascade, even if their distance is zero.
                //ALL nodes release their nodes when cascading begins.
                cascadingBlock.currentNode.releaseBlock();
                cascadingBlock.blockCascadeComplete = this.onEachBlockCascadeComplete.bind(this);
                cascadingBlock.cascadeBlockTo(cascadeVO.destination, (i == blocksToCascade.length -1));
            }
        }else{
            console.log("Dispatching BreakAndCascadeBlocksCompleteEvent due to there being nothing to cascade.")
            this.dispatchEvent(GridEvents.BreakAndCascadeBlocksCompleteEvent, this._gridNodes);
        }
    }

    private onEachBlockCascadeComplete(destinationCoord: Phaser.Point, fallenBlock: BlockMediator, wasLastBlockToCascade: boolean) {
        //All blocks reassign to their destination node on animation complete
        let destinationNode: GridNode = this._gridNodes.nodes.getValue(destinationCoord);
        destinationNode.assignBlock(fallenBlock);
        if(wasLastBlockToCascade){
            this.onLastBlockCascadeComplete();
        }
    }

    private onLastBlockCascadeComplete() {
        console.log("Dispatching BreakAndCascadeBlocksCompleteEvent due to final animation complete.")
        this.dispatchEvent(GridEvents.BreakAndCascadeBlocksCompleteEvent, this._gridNodes);
    }

    private onShowBlockSwapAnimationEvent(message?:any): void{
        if(message instanceof SwapVO){
            let swapVO = message as SwapVO;
            this.swapBlocks(swapVO.firstBlockCoord, swapVO.secondBlockCoord);
        }
    }

    private swapBlocks(firstGridCoord: Phaser.Point, secondGridCoord: Phaser.Point): void{
        let firstNode: GridNode = this._gridNodes.nodes.getValue(firstGridCoord);
        let secondNode: GridNode = this._gridNodes.nodes.getValue(secondGridCoord);
        let firstBlock: BlockMediator = firstNode.getCurrentBlock();
        let secondBlock: BlockMediator = secondNode.getCurrentBlock();

        firstNode.releaseBlock();
        secondNode.releaseBlock();
        firstNode.assignBlock(secondBlock);
        secondNode.assignBlock(firstBlock);
        
        secondBlock.blockMoveComplete = this.onSwapCandidateBlockMoveComplete.bind(this);
        firstBlock.blockMoveComplete = this.onSelectedBlockMoveComplete.bind(this);

        secondBlock.swapBlockTo(firstGridCoord);
        firstBlock.swapBlockTo(secondGridCoord);
    }

    private onRefillGridEvent(): void{
        this.respawnBlocks();
    }

    private respawnBlocks(): void{
        let cascadeStrategy: ICascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
        if(cascadeStrategy.shouldSpawnBlock){
            let spawnData: SpawnData = cascadeStrategy.nextSpawn;
            let block:BlockMediator = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
            block.blockMoveComplete = this.onBlockReSpawnCompleteCallback.bind(this);
            spawnData.destination.assignBlock(block);
            block.respawnBlockTo(spawnData.destination.gridCoordinate);
        }else{
            console.log("GridController.respawnBlocks()::: Our grid is full");
            this.dispatchEvent(GridEvents.RefillGridCompleteEvent);
        }
    }

    private onBlockReSpawnCompleteCallback(completedBlock: BlockMediator): void{
        completedBlock.blockMoveComplete = undefined;
        this.respawnBlocks();
    }


    private onSelectedBlockMoveComplete(completedBlock: BlockMediator): void{
        completedBlock.blockMoveComplete = undefined;
        //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
        this.dispatchEvent(GridEvents.SelectedBlockSwapAnimationCompleteEvent, this._gridNodes);
    }

    private onSwapCandidateBlockMoveComplete(completedBlock: BlockMediator): void{
        completedBlock.blockMoveComplete = undefined;
        //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
        this.dispatchEvent(GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent,this._gridNodes);
    }

    private onShowBlockSelectedEvent(message?:any): void{
        if(message instanceof Phaser.Point){
            this._gridNodes.nodes.getValue(message).getCurrentBlock().showBlockSelected();
        }
    }

    private onShowBlockUnselectedEvent(message?:any): void{
        if(message instanceof Phaser.Point){
            this._gridNodes.nodes.getValue(message).getCurrentBlock().showBlockUnselected();
        }
    }
}