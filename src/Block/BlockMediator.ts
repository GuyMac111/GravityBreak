import { Mediator } from "../System/Mediator";
import { BlockView } from "./BlockView";

export class BlockMediator extends Mediator{
    private _blockView: BlockView;
    blockMoveComplete: (completedBlock: BlockMediator)=>void ;

    constructor(startingGridPosition: Phaser.Point ,injectedView:BlockView){
        super();
        this._blockView = injectedView; 
        this._blockView.initialise(this.translateGridCoordsToWorld(startingGridPosition));
    }

    cascadeBlockTo(gridDestination: Phaser.Point): void{
        this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.onBlockMoveComplete.bind(this));
        console.log("BlockMediator::: Block move started")
    }

    onBlockMoveComplete(): void{
        console.log("BlockMediator::: Block completed cascading");
        if(this.blockMoveComplete!=null){
            this.blockMoveComplete(this);
        }
    }

    private translateGridCoordsToWorld(gridCoords: Phaser.Point): Phaser.Point{
        return new Phaser.Point(gridCoords.x*64, gridCoords.y*64);
    }

    
}