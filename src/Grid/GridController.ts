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

export class GridController extends EventHandler{
    private _gridNodes: NodeMesh;
    private _cascadeStrategyProvider: CascadeStrategyProvider;
    private _blockFactory: BlockFactory;
    
    constructor(nodesHigh:number, nodesWide:number, injectedBlockFactory: BlockFactory, injectedEventHub: EventHub){
        super(injectedEventHub);
        this.addEventListener(GridEvents.InitialiseGridEvent, this.onInitialiseEvent.bind(this));

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
        //Lets temporarliy use this func as our fall function...just for testing :)
        let cascadeStrategy: ICascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
        //TODO:: hmmmm....Maybe remove this check and just check here for undefined?
        if(cascadeStrategy.shouldSpawnBlock){
            let spawnData: SpawnData = cascadeStrategy.nextSpawn;
            let block:BlockMediator = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
            block.blockMoveComplete = this.onBlockSpawnComplete.bind(this);
            //Set the node's reference here so it can be omitted from future checks
            spawnData.destination.currentBlock = block;
            console.log(`GridController.spawnBlocks()::: Block move started (initial position ${spawnData.spawnNode.gridCoordinate.x},${spawnData.spawnNode.gridCoordinate.y})`);
            block.cascadeBlockTo(spawnData.destination.gridCoordinate);
        }else{
            //Our grid should be full at this point
            console.log("GridController.spawnBlocks()::: Our grid is fully cascaded.....supposedly.");
        }
    }

    private onBlockSpawnComplete(completedBlock: BlockMediator) : void{
        completedBlock.blockMoveComplete = undefined;
        this.spawnBlocks();
    }
}