import { Mediator } from "../System/Mediator";
import { BlockView } from "./BlockView";
import { SpawnData } from "../Cascade/SpawnData";
import { GridNode } from "../Grid/GridNode";

export class BlockMediator extends Mediator{
    private _blockView: BlockView;

    //TODO::: FOR DEBUGGING:REMOVE THIS AND EVERYTHING THAT USES IT!
    private _spawnData:SpawnData;

    blockMoveComplete: (completedBlock: BlockMediator, spawnData)=>void ;

    constructor(startingGridPosition: Phaser.Point ,injectedView:BlockView){
        super();
        this._blockView = injectedView; 
        this._spawnData = new SpawnData(new GridNode(startingGridPosition), new GridNode(startingGridPosition));
        this._blockView.initialise(this.translateGridCoordsToWorld(startingGridPosition));
    }

    cascadeBlockTo(gridDestination: Phaser.Point): void{
        this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.onBlockMoveComplete.bind(this));
        console.log(`BlockMediator::: Block move started (initial position ${this._spawnData.spawnNode.gridCoordinate.x},${this._spawnData.spawnNode.gridCoordinate.y})`);
    }

    onBlockMoveComplete(): void{
        console.log("BlockMediator::: Block completed cascading");
        if(this.blockMoveComplete!=null){
            this.blockMoveComplete(this, this._spawnData);
        }
    }

    private translateGridCoordsToWorld(gridCoords: Phaser.Point): Phaser.Point{
        return new Phaser.Point(gridCoords.x*64, gridCoords.y*64);
    }

    
}