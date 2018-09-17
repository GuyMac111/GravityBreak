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
import { BlockEvents } from "../Block/BlockEvents";
import { GridModel } from "./GridModel";
import { swap } from "typescript-collections/dist/lib/arrays";
import { SwapVO } from "./VOs/SwapVO";

export class GridController extends EventHandler{
    private _gridNodes: NodeMesh;
    private _cascadeStrategyProvider: CascadeStrategyProvider;
    private _blockFactory: BlockFactory;
    
    constructor(nodesHigh:number, nodesWide:number, injectedBlockFactory: BlockFactory, injectedEventHub: EventHub){
        super(injectedEventHub);
        this.addEventListener(GridEvents.InitialiseGridEvent, this.onInitialiseEvent.bind(this));
        this.addEventListener(GridEvents.ShowBlockSelectedEvent, this.onShowBlockSelectedEvent.bind(this));
        this.addEventListener(GridEvents.ShowBlockUnselectedEvent, this.onShowBlockUnselectedEvent.bind(this));
        this.addEventListener(GridEvents.ShowBlockSwapAnimationEvent, this.onShowBlockSwapAnimationEvent.bind(this));

        let dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
        this._blockFactory = injectedBlockFactory;
        //TODO: move instantiation of NodeMeshFactory into bootstrap and 'inject'
        let nodeMeshFactory: NodeMeshFactory = new NodeMeshFactory();
        this._gridNodes = nodeMeshFactory.createNodeMesh(dimensionsInNodes);
        this._cascadeStrategyProvider = new CascadeStrategyProvider(this._gridNodes);
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
        //TODO:: hmmmm....Maybe remove this check and just check here for undefined?
        if(cascadeStrategy.shouldSpawnBlock){
            let spawnData: SpawnData = cascadeStrategy.nextSpawn;
            let block:BlockMediator = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
            block.blockMoveComplete = this.onBlockSpawnCompleteCallback.bind(this);
            //Set the node's reference here so it can be omitted from future checks
            spawnData.destination.currentBlock = block;
            //Set the blockMediators ref to the destination node so that it can access its own location for input events
            block.currentNode = spawnData.destination;
            console.log(`GridController.spawnBlocks()::: Block move started (initial position ${spawnData.spawnNode.gridCoordinate.x},${spawnData.spawnNode.gridCoordinate.y})`);
            block.cascadeBlockTo(spawnData.destination.gridCoordinate);
        }else{
            //Our grid should be full at this point
            console.log("GridController.spawnBlocks()::: Our grid is fully cascaded.....supposedly.");
        }
    }

    private onBlockSpawnCompleteCallback(completedBlock: BlockMediator) : void{
        completedBlock.blockMoveComplete = undefined;
        this.spawnBlocks();
    }

    private onShowBlockSelectedEvent(message?:any): void{
        if(message instanceof Phaser.Point){
            console.log(`GridController.onShowBlockSelectedEvent()::: Selecting block ${message}`);
            this._gridNodes.nodes.getValue(message).currentBlock.showBlockSelected();
        }
    }

    private onShowBlockUnselectedEvent(message?:any): void{
        if(message instanceof Phaser.Point){
            console.log(`GridController.onShowBlockUnselectedEvent()::: Unselecting block ${message}`);
            this._gridNodes.nodes.getValue(message).currentBlock.showBlockUnselected();
        }
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
        let holdThisForASecond: BlockMediator = firstNode.currentBlock;
        firstNode.currentBlock = secondNode.currentBlock;
        secondNode.currentBlock = holdThisForASecond;
        firstNode.currentBlock.currentNode = firstNode;
        secondNode.currentBlock.currentNode = secondNode;
        //As the nodes are now already holding their swapped values, we send the inverse and swap instruction events.
        firstNode.currentBlock.blockMoveComplete = this.onSwapCandidateBlockMoveComplete.bind(this);
        secondNode.currentBlock.blockMoveComplete = this.onSelectedBlockMoveComplete.bind(this);
        firstNode.currentBlock.swapBlockTo(firstGridCoord);
        secondNode.currentBlock.swapBlockTo(secondGridCoord);
    }

    private onSelectedBlockMoveComplete(completedBlock: BlockMediator): void{
        completedBlock.blockMoveComplete = undefined;
        this.dispatchEvent(GridEvents.SelectedBlockSwapAnimationCompleteEvent);
    }

    private onSwapCandidateBlockMoveComplete(completedBlock: BlockMediator): void{
        completedBlock.blockMoveComplete = undefined;
        this.dispatchEvent(GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent);
    }
}