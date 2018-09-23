import { BlockFactory } from "../Block/BlockFactory";
import { ISystemModel } from "./ISystemModel";
import { EventHub } from "./Events/EventHub";
import { InputController } from "../Input/InputController";
import { GridStateController } from "../Grid/GridStateController";
import { GridEvaluator } from "../Grid/GridEvaluator";
import { GridController } from "../Grid/GridController";
import { GravityStateModel } from "../Gravity/GravityStateModel";
import { CascadeStrategyProvider } from "../Cascade/CascadeStrategyProvider";
import { NodeMesh } from "../Grid/NodeMesh";
import { ScoreModel } from "../Score/ScoreModel";
import { SoundController } from "../Sound/SoundController";

//////
//This class is essentially a BTEC program context
//////
export class SystemModel implements ISystemModel{
private _blockFactory: BlockFactory;
    private _eventHub: EventHub;
    private _inputController: InputController;
    private _gridModel: GridStateController;
    private _gridEvaluator: GridEvaluator;
    private _gridController: GridController;
    private _cascadeStrategyProvider: CascadeStrategyProvider;
    private _nodeMesh: NodeMesh;
    private _scoreModel: ScoreModel;
    private _soundController: SoundController;

    get soundController(): SoundController {
		return this._soundController;
	}

    set soundController(value: SoundController) {
		this._soundController = value;
	}

	get scoreModel(): ScoreModel {
		return this._scoreModel;
	}

    set scoreModel(value: ScoreModel) {
		this._scoreModel = value;
	}

    get nodeMesh(): NodeMesh {
		return this._nodeMesh;
    }
    
    set nodeMesh(value: NodeMesh) {
		this._nodeMesh = value;
	}
    
    get cascadeStrategyProvider(): CascadeStrategyProvider {
		return this._cascadeStrategyProvider;
	}

    set cascadeStrategyProvider(value: CascadeStrategyProvider) {
		this._cascadeStrategyProvider = value;
	}

	get gravityStateModel(): GravityStateModel {
		return this._gravityStateModel;
	}

	set gravityStateModel(value: GravityStateModel) {
		this._gravityStateModel = value;
	}
    private _gravityStateModel: GravityStateModel;

    set gridModel(gridModel: GridStateController){
        this._gridModel = gridModel;
    }

    get gridModel(): GridStateController{
        return this._gridModel;
    }
    set blockFactory(blockFactory: BlockFactory){
        this._blockFactory = blockFactory;
    }

    get blockFactory(): BlockFactory{
        return this._blockFactory;
    }

    set eventHub(eventHub: EventHub) {
        this._eventHub = eventHub;
    }

    get eventHub(): EventHub{
        return this._eventHub;
    }

    set inputController(inputController: InputController) {
        this._inputController = inputController;
    }

    get inputController(): InputController{
        return this._inputController;
    
    }
    set gridEvaluator(gridEvaluator: GridEvaluator) {
        this._gridEvaluator = gridEvaluator;
    }

    get gridEvaluator(): GridEvaluator{
        return this._gridEvaluator;
    }

    set gridController(gridController: GridController) {
        this._gridController = gridController;
    }

    get gridController(): GridController{
        return this._gridController;
    }

    
}