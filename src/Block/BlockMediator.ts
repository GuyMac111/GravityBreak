import { Mediator } from "../System/Mediator";
import { BlockView } from "./BlockView";
import { BlockColour } from "./BlockColour";
import { EventHub } from "../System/Events/EventHub";
import { BlockEvents } from "./BlockEvents";
import { GridNode } from "../Grid/GridNode";

export class BlockMediator extends Mediator{
    private readonly SPAWN_DURATION: number = 7;
    private readonly RESPAWN_DURATION: number = 50;
    private readonly SWAP_DURATION: number = 100;
    private readonly CASCADE_DURATION: number = 200;

    private _blockView: BlockView;
    private _blockColour: BlockColour;
    private _isLastBlockToCascade: boolean = false;
    private _cascadeDestination: Phaser.Point;
    
    currentNode: GridNode;

    blockMoveComplete: (completedBlock: BlockMediator)=>void;
    blockDestroyComplete: (completedBlock: BlockMediator)=>void;
    blockCascadeComplete: (destination: Phaser.Point, fallenBlock: BlockMediator, isLastBlockToCascade:boolean)=>void;

    constructor(startingGridPosition: Phaser.Point, colour: BlockColour, injectedView:BlockView, injectedEventHub: EventHub){
        super(injectedEventHub);
        this._blockView = injectedView;
        this._blockColour = colour;
        this._blockView.initialise(startingGridPosition, this._blockColour);
        this._blockView.onTouch = this.onViewTouched.bind(this);
    }

    spawnBlockTo(gridDestination: Phaser.Point): void{
        this._blockView.moveToPosition(gridDestination, this.SPAWN_DURATION,this.onBlockMoveComplete.bind(this));
    }

    respawnBlockTo(gridDestination: Phaser.Point): void{
        this._blockView.moveToPosition(gridDestination, this.RESPAWN_DURATION,this.onBlockMoveComplete.bind(this));
    }

    swapBlockTo(gridDestination: Phaser.Point): void {
        this._blockView.moveToPosition(gridDestination, this.SWAP_DURATION,this.onBlockMoveComplete.bind(this));
    }

    cascadeBlockTo(gridDestination: Phaser.Point, isLastBlockToCascade: boolean): void {
        this._isLastBlockToCascade = isLastBlockToCascade;
        this._cascadeDestination = gridDestination;
        this._blockView.moveToPosition(gridDestination, this.CASCADE_DURATION, this.onCascadeMovementComplete.bind(this));
    }

    private onCascadeMovementComplete(): void{
        let lastToCascade: boolean = this._isLastBlockToCascade;
        let destination: Phaser.Point = this._cascadeDestination;
        this.blockCascadeComplete(destination, this, lastToCascade);
        this._cascadeDestination = undefined;
        this._isLastBlockToCascade = false;
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