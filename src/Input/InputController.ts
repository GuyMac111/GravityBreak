import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { BlockEvents } from "../Block/BlockEvents";
import { GridStateController } from "../Grid/GridStateController";
import { InputEvents } from "./InputEvents";
import { GravityEvents } from "../Gravity/GravityEvent";
import { PlanetEvents } from "../Background/PlanetEvents";
import { TimerEvents } from "../System/Time/TimerEvents";

export class InputController extends EventHandler{
    private _gridModel: GridStateController;

    constructor(injectedEventHub: EventHub, injectedGridModel: GridStateController){
        super(injectedEventHub);
        this._gridModel = injectedGridModel;
        this.addEventListener(InputEvents.EnableInputsEvent, this.unlockUserInput.bind(this));
        this.addEventListener(InputEvents.DisableInputsEvent, this.lockUserInput.bind(this));
        this.addEventListener(TimerEvents.TimeExpiredEvent, this.onTimeOverEvent.bind(this));
    }

    private unlockUserInput(): void{
        this.addEventListener(BlockEvents.BlockTouchedEvent, this.onBlockTouched.bind(this));
        this.addEventListener(InputEvents.RotateRightTouched, this.onRotateLeftTouched.bind(this));
        this.addEventListener(InputEvents.RotateLeftTouched, this.onRotateRightTouched.bind(this));
    }

    private lockUserInput(): void{
        this.removeEventListener(BlockEvents.BlockTouchedEvent);
        this.removeEventListener(InputEvents.RotateRightTouched);
        this.removeEventListener(InputEvents.RotateLeftTouched);
    }

    //This is naughty. We're controlling too much state in the gravity stuff in here really. But this would be remedied by a proper state machine.
    private onRotateRightTouched() {
        this.lockUserInput();
        this.dispatchEvent(GravityEvents.GravityRotateRightEvent);
        this.addEventListener(PlanetEvents.PlanetMoveCompleteEvent, this.unlockUserInput.bind(this));
        this.dispatchEvent(PlanetEvents.StartPlanetMoveEvent);
    }
    
    private onRotateLeftTouched() {
        this.lockUserInput();
        this.dispatchEvent(GravityEvents.GravityRotateLeftEvent);
        this.addEventListener(PlanetEvents.PlanetMoveCompleteEvent, this.unlockUserInput.bind(this));
        this.dispatchEvent(PlanetEvents.StartPlanetMoveEvent);
    }

    private onBlockTouched(message?:any):void {
        this._gridModel.selectBlock(message);
    }

    private onTimeOverEvent(): void{
        this.removeEventListener(InputEvents.EnableInputsEvent);
        //this is because if there's a pending enable event when the time runs out, the input will unlock after the time expires.
        this.lockUserInput();
    }
}