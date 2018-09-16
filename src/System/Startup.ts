import { BlockFactory } from "../Block/BlockFactory";
import { SystemModel } from "./SystemModel";
import { ISystemModel } from "./ISystemModel";
import { GridController } from "../Grid/GridController";
import { EventHub } from "./Events/EventHub";
import { GridEvents } from "../Grid/GridEvents";

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
        let gridController: GridController = new GridController(10,10,this._systemModel.blockFactory, this._systemModel.eventHub);
        this.systemModel.eventHub.dispatchEvent(GridEvents.InitialiseGridEvent);   
    }
    
    private bootstrapGame():void {
        this.bootstrapEventHub();
        this.bootstrapBlockFactory();
    }

    private bootstrapEventHub():void {
        let eventHub: EventHub = new EventHub();
        this._systemModel.eventHub = eventHub;
    }
    
    private bootstrapBlockFactory():void {
        let blockLayerGroup: Phaser.Group = this._game.add.group();
        let blockFactory: BlockFactory = new BlockFactory(this._game, blockLayerGroup)
        this._systemModel.blockFactory = blockFactory;
    }
    
    get systemModel(): ISystemModel{
        return this._systemModel;
    }
}