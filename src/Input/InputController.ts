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
            if(this._gridModel.gridEvaluationInProgress){
                //Bad, I know. Using this flag as a caveman state. Preventing touch in illegal states.
                return;
            }
            let gridLocationOfTouch: Phaser.Point = message;
            if(!this._gridModel.hasCurrentlySelectedBlock){
                this._gridModel.currentlySelectedCoord = gridLocationOfTouch;
            }else if(this._gridModel.swapCandidateCoord==undefined){
                this._gridModel.swapCandidateCoord = gridLocationOfTouch;
            }
        }
    }

    private printMessageIssue(message:any){
        console.log(`Something went wrong with message ${message}`);
    }
}