import { Mediator } from "../System/Mediator";
import { EventHub } from "../System/Events/EventHub";
import { PlanetView } from "./PlanetView";
import { PlanetEvents } from "./PlanetEvents";
import { GravityStateModel } from "../Gravity/GravityStateModel";

export class PlanetMediator extends Mediator{
    private _planetView: PlanetView;
    private _gravityStateModel: GravityStateModel;

    constructor(injectedGravityStateModel:GravityStateModel, injectedView:PlanetView, injectedEventHub: EventHub){
        super(injectedEventHub)
        this._gravityStateModel = injectedGravityStateModel;
        this._planetView = injectedView;
        this._planetView.initialise();
        this.addEventListener(PlanetEvents.StartPlanetMoveEvent, this.onMovePlanetEvent.bind(this));
    }

    private onMovePlanetEvent(): void{
        this._planetView.movePlanet(this._gravityStateModel.currentState, this.onPlanetMoveComplete.bind(this));
    }

    private onPlanetMoveComplete():void{
        this.dispatchEvent(PlanetEvents.PlanetMoveCompleteEvent);
    }
}