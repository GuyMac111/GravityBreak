import { EventHub } from "../System/Events/EventHub";
import { Mediator } from "../System/Mediator";
import { ControlPanelView } from "./ControlPanelView";
import { InputEvents } from "../Input/InputEvents";
import { ScoreModel } from "../Score/ScoreModel";

export class ControlPanelMediator extends Mediator{
    private _controlPanelView: ControlPanelView;
    private _scoreModel: ScoreModel;
    
    constructor(injectedScoreModel: ScoreModel ,injectedView: ControlPanelView, injectedEventHub: EventHub){
        super(injectedEventHub);
        this._scoreModel = injectedScoreModel;
        this._scoreModel.scoreUpdated = this.onScoreUpdated.bind(this);
        this._controlPanelView = injectedView;
        this._controlPanelView.initialise();
        this._controlPanelView.rotateLeftTouched = this.onRotateLeftTouched.bind(this);
        this._controlPanelView.rotateRightTouched = this.onRotateRightTouched.bind(this);
    }

    private onRotateRightTouched(): void{
        this.dispatchEvent(InputEvents.RotateRightTouched);
    }

    private onRotateLeftTouched(): void{
        this.dispatchEvent(InputEvents.RotateLeftTouched);
    }

    private onScoreUpdated(newScore: number, additionalAmount: number): void{
        this._controlPanelView.updateScore(newScore, additionalAmount);
    }
} 