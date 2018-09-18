import { BlockFactory } from "../Block/BlockFactory";
import { ISystemModel } from "./ISystemModel";
import { EventHub } from "./Events/EventHub";
import { InputController } from "../Input/InputController";
import { GridModel } from "../Grid/GridModel";
import { GridEvaluator } from "../Grid/GridEvaluator";
import { GridController } from "../Grid/GridController";

export class SystemModel implements ISystemModel{
    private _blockFactory: BlockFactory;
    private _eventHub: EventHub;
    private _inputController: InputController;
    private _gridModel: GridModel;
    private _gridEvaluator: GridEvaluator;
    private _gridController: GridController;

    set gridModel(gridModel: GridModel){
        this._gridModel = gridModel;
    }

    get gridModel(): GridModel{
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