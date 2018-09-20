import { Mediator } from "../System/Mediator";
import { BlockView } from "./BlockView";
import { BlockColour } from "./BlockColour";
import { EventHub } from "../System/Events/EventHub";
import { BlockEvents } from "./BlockEvents";
import { GridNode } from "../Grid/GridNode";

export class BlockMediator extends Mediator{
    private readonly SPAWN_DURATION: number = 10;
    private readonly SWAP_DURATION: number = 100;
    private readonly CASCADE_DURATION: number = 200;

    private currentY:number;////YOU LEFT OFF:
    //ON THE SECOND BREAK, SOME BLOCKS ARE MOVING UP AND HAVE NO REFERENCE TO A GRIDNODE.
    //FIRST FIND OOUT WHY THEYRE MOVING UPWARD. 
    //WE SHOULD START BY CHECKING HERE BY STORING ALL Y VALUES. AND LOGGING WHENEVER IT'S TOLD TO MOVE UP.

    

    private _blockView: BlockView;
    private _blockColour: BlockColour;
    currentNode: GridNode;//Didn't want to do this, but it's the cleanest way for a BlockMediator to get it's own location 

    blockMoveComplete: (completedBlock: BlockMediator)=>void;
    blockDestroyComplete: (completedBlock: BlockMediator)=>void;

    constructor(startingGridPosition: Phaser.Point, colour: BlockColour, injectedView:BlockView, injectedEventHub: EventHub){
        super(injectedEventHub);
        this._blockView = injectedView;
        this._blockColour = colour;
        this._blockView.initialise(startingGridPosition, this._blockColour);
        this.currentY=startingGridPosition.y;
        this._blockView.onTouch = this.onViewTouched.bind(this);
    }

    spawnBlockTo(gridDestination: Phaser.Point): void{
        if(gridDestination.y<this.currentY){
            console.log("STOP!!!");
        }
        this.currentY=gridDestination.y;
        this._blockView.moveToPosition(gridDestination, this.SPAWN_DURATION,this.onBlockMoveComplete.bind(this));
    }

    swapBlockTo(gridDestination: Phaser.Point): void {
        if(gridDestination.y<this.currentY){
            console.log("STOP!!!");
        }
        this.currentY=gridDestination.y;
        this._blockView.moveToPosition(gridDestination, this.SWAP_DURATION,this.onBlockMoveComplete.bind(this));
    }

    cascadeBlockTo(gridDestination: Phaser.Point): void {
        if(gridDestination.y<this.currentY){
            console.log("STOP!!!");
        }
        this.currentY=gridDestination.y;
        this._blockView.moveToPosition(gridDestination, this.CASCADE_DURATION, this.onBlockMoveComplete.bind(this));
    }

    private onBlockMoveComplete(): void{
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
        this._blockView.destroySpriteInstance();
        if(this.blockDestroyComplete!=undefined){
            this.blockDestroyComplete(this);
        }
    }

    get blockColour(): BlockColour{
        return this._blockColour;
    }

    private onViewTouched(): void {
        if(this.currentNode!=undefined){
            this.dispatchEvent(BlockEvents.BlockTouchedEvent, this.currentNode.gridCoordinate);
        }
    }
}