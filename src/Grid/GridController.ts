import { NodeMeshFactory } from "./NodeMeshFactory";
import { NodeMesh } from "./NodeMesh";
import { CascadeStrategyProvider } from "../Cascade/CascadeStrategyProvider";
import { ICascadeStrategy } from "../Cascade/ICascadeStrategy";
import { BlockFactory } from "../Block/BlockFactory";
import { SpawnData } from "../Cascade/SpawnData";
import { BlockMediator } from "../Block/BlockMediator";

export class GridController{
    private _gridNodes: NodeMesh;
    private _cascadeStrategyProvider: CascadeStrategyProvider;
    private _blockFactory: BlockFactory;
    
    constructor(nodesHigh:number, nodesWide:number, injectedBlockFactory: BlockFactory){
        let dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
        this._blockFactory = injectedBlockFactory;
        //TODO: move instantiation of NodeMeshFactory into bootstrap and 'inject'
        let nodeMeshFactory: NodeMeshFactory = new NodeMeshFactory();
        this._gridNodes = nodeMeshFactory.createNodeMesh(dimensionsInNodes);
        this._cascadeStrategyProvider = new CascadeStrategyProvider(this._gridNodes);
    }

    //TODO: using strategy provider we should now attempt filling the grid.

    initialiseGrid(): void{
        //Lets temporarliy use this func as our fall function...just for testing :)
        let cascadeStrategy: ICascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
        //TODO:: hmmmm....Maybe remove this check and just check here for undefined?
        if(cascadeStrategy.shouldSpawnBlock){
            let spawnData: SpawnData = cascadeStrategy.getNextSpawn();
            let block:BlockMediator = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
            block.blockMoveComplete = this.onBlockFallComplete.bind(this);
            //Set the node's reference here so it can be omitted from future checks
            spawnData.destination.currentBlock = block;
            block.cascadeBlockTo(spawnData.destination.gridCoordinate);

        }else{
            //Our grid should be full at this point
            console.log("GridController::: Our grid is fully cascaded.....supposedly.");
        }
    }

    private onBlockFallComplete(completedBlock: BlockMediator) : void {
        console.log("GridController::: Block move complete acknowledged.")
        completedBlock.blockMoveComplete = undefined;
        this.initialiseGrid();
        //YOU LEFT OFF::: We have our thrown error regarding calling for extra blocks to be added when none can be 
        //after the check that's "meant" to be protecting us
    }
}