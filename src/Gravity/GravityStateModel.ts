import { GravityState } from "./GravityState";
import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { GravityEvents } from "./GravityEvent";

export class GravityStateModel extends EventHandler{
    private _currentState: GravityState;
    
    constructor(injectedEventHub: EventHub){
        super(injectedEventHub);
        this._currentState = GravityState.Down;
        this.addEventListener(GravityEvents.GravityRotateLeftEvent, this.onGravityRotateLeftEvent.bind(this));
        this.addEventListener(GravityEvents.GravityRotateRightEvent, this.onGravityRotateRightEvent.bind(this));
    }

    get currentState(): GravityState{
        return this._currentState;
    }

    private onGravityRotateLeftEvent():void{
        switch(this._currentState){
            case GravityState.Down:
                this._currentState = GravityState.Left;
                break;
            case GravityState.Left:
                this._currentState = GravityState.Up;
                break;
            case GravityState.Up:
                this._currentState = GravityState.Right;
                break;
            case GravityState.Right:
                this._currentState = GravityState.Down;
                break;
            default:
                break;
        }
    }

    private onGravityRotateRightEvent(): void{
        switch(this._currentState){
            case GravityState.Down:
                this._currentState = GravityState.Right;
                break;
            case GravityState.Right:
                this._currentState = GravityState.Up;
                break;
            case GravityState.Up:
                this._currentState = GravityState.Left;
                break;
            case GravityState.Left:
                this._currentState = GravityState.Down;
                break;
            default:
                break;
        }
    }
}