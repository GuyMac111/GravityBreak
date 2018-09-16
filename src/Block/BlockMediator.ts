import { Mediator } from "../System/Mediator";
import { BlockView } from "./BlockView";
import { BlockColour } from "./BlockColour";
import { EventHub } from "../System/Events/EventHub";
import { BlockEvents } from "./BlockEvents";
import { GridNode } from "../Grid/GridNode";

export class BlockMediator extends Mediator{
    private _blockView: BlockView;
    private _blockColour: BlockColour;
    private _currentNode: GridNode;//Didn't want to do this, but it's the cleanest way for a BlockMediator to get it's own location 

    blockMoveComplete: (completedBlock: BlockMediator)=>void;

    constructor(startingGridPosition: Phaser.Point, colour: BlockColour, injectedView:BlockView, injectedEventHub: EventHub){
        super(injectedEventHub);
        this._blockView = injectedView;
        this._blockColour = colour;
        this._blockView.initialise(this.translateGridCoordsToWorld(startingGridPosition), this._blockColour);
        this._blockView.onTouch = this.onViewTouched.bind(this);
    }

    cascadeBlockTo(gridDestination: Phaser.Point): void{
        this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.onBlockMoveComplete.bind(this));
    }

    onBlockMoveComplete(): void{
        console.log("BlockMediator.onBlockMoveComplete()::: Block completed cascading");
        if(this.blockMoveComplete!=null){
            this.blockMoveComplete(this);
        }
    }

    showBlockSelected(): void{
        this._blockView.showBlockSelected();
    }

    set currentNode(node: GridNode){
        this._currentNode = node;
    }

    private translateGridCoordsToWorld(gridCoords: Phaser.Point): Phaser.Point{
        return new Phaser.Point(gridCoords.x*64, gridCoords.y*64);
    }

    private onViewTouched(): void {
        if(this._currentNode!=undefined){
            this.dispatchEvent(BlockEvents.BlockTouchedEvent, this._currentNode.gridCoordinate);
        }
    }
}