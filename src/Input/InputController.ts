import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { GridEvents } from "../Grid/GridEvents";
import { BlockEvents } from "../Block/BlockEvents";
import { GridModel } from "../Grid/GridModel";

export class InputController extends EventHandler{
    private _gridModel: GridModel;

    constructor(injectedEventHub: EventHub, injectedGridModel: GridModel){
        super(injectedEventHub);
        this._gridModel = injectedGridModel;
        this.addEventListener(BlockEvents.BlockTouchedEvent, this.onBlockTouched.bind(this));
    }

    private onBlockTouched(message?:any):void {
        if(!(message instanceof Phaser.Point)){
            this.printMessageIssue(message);
        }else{
            let gridLocationOfTouch: Phaser.Point = message;
            if(!this._gridModel.hasCurrentlySelectedBlock){
                this._gridModel.currentlySelectedCoord = gridLocationOfTouch;
                this.dispatchEvent(GridEvents.ShowBlockSelectedEvent, gridLocationOfTouch);
            }else if(this._gridModel.swapCandidateCoord==undefined){
                this._gridModel.swapCandidateCoord = gridLocationOfTouch;
                this.dispatchEvent(GridEvents.ShowBlockSelectedEvent, gridLocationOfTouch);
                //TODO::: At this point we should tell the grid to reset both blocks initiate swap.
                //The grid should then update the GridModel once it's down attempting to swap/possibly swapping back
                //Perhaps done by a grid evaluator?
            }
        }
    }

    private printMessageIssue(message:any){
        console.log(`Something went wrong with message ${message}`);
    }
}