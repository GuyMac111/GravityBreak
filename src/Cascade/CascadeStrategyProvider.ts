import { ICascadeStrategy } from "./ICascadeStrategy";
import { NodeMesh } from "../Grid/NodeMesh";
import { DownCascadeStrategy } from "./DownCascadeStrategy";
import { UpCascadeStrategy } from "./UpCascadeStrategy";
import { LeftCascadeStrategy } from "./LeftCascadeStrategy";
import { RightCascadeStrategy } from "./RightCascadeStrategy";
import { GravityStateModel } from "../Gravity/GravityStateModel";
import { GravityState } from "../Gravity/GravityState";
import { Dictionary } from "typescript-collections";

export class CascadeStrategyProvider{

    private _gravityStateModel: GravityStateModel;y;
    private _strategyStateMap: Dictionary<GravityState, ICascadeStrategy>;

        
    constructor(nodeMesh: NodeMesh, injectedGridStateModel: GravityStateModel){
        this._gravityStateModel = injectedGridStateModel;
        this.initialiseStrategies(nodeMesh);
    }
    
    get cascadeStrategy(): ICascadeStrategy{
        return this._strategyStateMap.getValue(this._gravityStateModel.currentState);
        // return this._strategyStateMap.getValue(GravityState.Left);
    }

    private initialiseStrategies(nodeMesh: NodeMesh): void{
        this._strategyStateMap = new Dictionary<GravityState,ICascadeStrategy>();
        this._strategyStateMap.setValue(GravityState.Down, new DownCascadeStrategy(nodeMesh));
        this._strategyStateMap.setValue(GravityState.Up, new UpCascadeStrategy(nodeMesh));
        this._strategyStateMap.setValue(GravityState.Left, new LeftCascadeStrategy(nodeMesh));
        this._strategyStateMap.setValue(GravityState.Right, new RightCascadeStrategy(nodeMesh));
    }

    //YOU LEFT OFF:: LET'S GET A STATE CONTOLLER FOR THIS AND THEN WIRE IT IN TO THE INPUT CONTROLLER
    //THEN SCORE
    //THEN SOUND
    //THEN ANIMATION
    //THEN GAME OVER
}