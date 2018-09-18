import { BlockFactory } from "../Block/BlockFactory";
import { SystemModel } from "./SystemModel";
import { ISystemModel } from "./ISystemModel";
import { GridController } from "../Grid/GridController";
import { EventHub } from "./Events/EventHub";
import { GridEvents } from "../Grid/GridEvents";
import { InputController } from "../Input/InputController";
import { GridModel } from "../Grid/GridModel";
import { GridEvaluator } from "../Grid/GridEvaluator";

export class Startup{
    private _game: Phaser.Game;
    ////
    //hmmmmm: Does this need to exist?.......so far....no.
    private _systemModel: SystemModel;
    ////

    ///Perhaps we should separate Startup into 1: Bootstrap and 2: Initialise
    ///Don't really intend to create a full context so we can keep things close in here for the time being
    ///and then decide to split things apart if things get too tightly coupled
    
    constructor(game: Phaser.Game){
        this._game = game;
    }
    
    initialiseGame(){
        this._systemModel = new SystemModel();
        this.bootstrapGame();
        this.initialise();
    }
    
    private initialise():void {
        this.systemModel.eventHub.dispatchEvent(GridEvents.InitialiseGridEvent);   
    }
    
    private bootstrapGame():void {
        //Order is starting to become a concern here. Maaay need to rethink this in terms of categories.
        this.bootstrapEventHub();
        this.bootstrapModels();
        this.bootstrapInput();
        this.bootstrapBlockFactory();
        this.bootstrapGrid();
    }

    private bootstrapEventHub():void {
        let eventHub: EventHub = new EventHub();
        this._systemModel.eventHub = eventHub;
    }
    
    private bootstrapBlockFactory():void {
        let blockLayerGroup: Phaser.Group = this._game.add.group();
        let blockFactory: BlockFactory = new BlockFactory(this._game, blockLayerGroup, this._systemModel.eventHub);
        this._systemModel.blockFactory = blockFactory;
    }

    private bootstrapInput():void {
        let inputController: InputController = new InputController(this._systemModel.eventHub, this._systemModel.gridModel);
        this._systemModel.inputController = inputController; 
    }

    private bootstrapModels(): void {
        this._systemModel.gridModel = new GridModel(this._systemModel.eventHub); 
    }

    private bootstrapGrid(): void{
        let gridEvaluator:GridEvaluator = new GridEvaluator(this._systemModel.eventHub);
        this._systemModel.gridEvaluator = gridEvaluator;
        let gridController: GridController = new GridController(9,9,this._systemModel.blockFactory, this._systemModel.eventHub);
        this._systemModel.gridController = gridController;
    }

    get systemModel(): ISystemModel{
        return this._systemModel;
    }
}