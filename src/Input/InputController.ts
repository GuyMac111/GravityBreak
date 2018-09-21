import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { GridEvents } from "../Grid/GridEvents";
import { BlockEvents } from "../Block/BlockEvents";
import { GridModel } from "../Grid/GridModel";
import { InputEvents } from "./InputEvents";

export class InputController extends EventHandler{
    private _gridModel: GridModel;

    constructor(injectedEventHub: EventHub, injectedGridModel: GridModel){
        super(injectedEventHub);
        this._gridModel = injectedGridModel;
        this.addEventListener(InputEvents.EnableInputsEvent, this.onEnableInputsEvent.bind(this));
        this.addEventListener(InputEvents.DisableInputsEvent, this.onDisableInputsEvent.bind(this));
    }

    private onEnableInputsEvent(): void{
        this.addEventListener(BlockEvents.BlockTouchedEvent, this.onBlockTouched.bind(this));
    }

    private onDisableInputsEvent(): void{
        this.removeEventListener(BlockEvents.BlockTouchedEvent);
    }

    private onBlockTouched(message?:any):void {
        this._gridModel.selectBlock(message);
    }

    private printMessageIssue(message:any){
        console.log(`Something went wrong with message ${message}`);
    }
}