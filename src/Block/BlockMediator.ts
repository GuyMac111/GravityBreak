import { Mediator } from "../System/Mediator";
import { BlockView } from "./BlockView";
import { BlockColour } from "./BlockColour";
import { EventHub } from "../System/Events/EventHub";
import { BlockEvents } from "./BlockEvents";
import { GridNode } from "../Grid/GridNode";

export class BlockMediator extends Mediator{
    private readonly FALL_DURATION: number = 10;
    private readonly SWAP_DURATION: number = 100;
    private _blockView: BlockView;
    private _blockColour: BlockColour;
    private _currentNode: GridNode;//Didn't want to do this, but it's the cleanest way for a BlockMediator to get it's own location 

    blockMoveComplete: (completedBlock: BlockMediator)=>void;
    blockDestroyComplete: (completedBlock: BlockMediator)=>void;

    constructor(startingGridPosition: Phaser.Point, colour: BlockColour, injectedView:BlockView, injectedEventHub: EventHub){
        super(injectedEventHub);
        this._blockView = injectedView;
        this._blockColour = colour;
        this._blockView.initialise(this.translateGridCoordsToWorld(startingGridPosition), this._blockColour);
        this._blockView.onTouch = this.onViewTouched.bind(this);
    }

    cascadeBlockTo(gridDestination: Phaser.Point): void{
        this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.FALL_DURATION,this.onBlockMoveComplete.bind(this));
    }

    swapBlockTo(gridDestination: Phaser.Point): void {
        this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.SWAP_DURATION,this.onBlockMoveComplete.bind(this));
    }

    private onBlockMoveComplete(): void{
        console.log("BlockMediator.onBlockMoveComplete()::: Block completed movement");
        if(this.blockMoveComplete!=null){
            this.blockMoveComplete(this);
        }
    }

    showBlockSelected(): void{
        this._blockView.showBlockSelected();
    }

    showBlockUnselected(): void{
        this._blockView.showBlockUnselected();
    }

    showBlockDestroyAnimation(delay:number): void{
        this._blockView.showBlockDestroyAnimation(delay,this.onBlockDestroyComplete.bind(this));
    }

    private onBlockDestroyComplete(): void{
        console.log("BlockMediator.onBlockDestroyComplete()::: Block completed destroy anim");
        this._blockView.destroySpriteInstance();
        if(this.blockDestroyComplete!=undefined){
            this.blockDestroyComplete(this);
        }
    }

    set currentNode(node: GridNode){
        this._currentNode = node;
    }

    get blockColour(): BlockColour{
        return this._blockColour;
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