import { BlockFactory } from "../Block/BlockFactory";
import { SystemModel } from "./SystemModel";
import { ISystemModel } from "./ISystemModel";
import { GridController } from "../Grid/GridController";

export class Startup{
    private _game: Phaser.Game;
    ////
    //hmmmmm: Does this need to exist?
    private _systemModel: SystemModel;
    ////

    ///Perhaps we should separate Startup into 1: Bootstrap and 2: Initialise
    ///Don't really intend to create a full context so we can keep things close in here for the time being
    ///and then decide to split things apart if things get too tightly coupled
    
    constructor(game: Phaser.Game){
        this._game = game;
    }
    
    initialiseGame(){
        this.bootstrapGame();
        this.initialiseGrid();
    }

    get systemModel(): ISystemModel{
        return this._systemModel;
    }

    private bootstrapGame(){
        this.bootstrapBlockFactory();
    }

    private initialiseGrid(){
        let gridController: GridController = new GridController(10,10);
        //YOU LEFT OFF: You were about to refactor GridController into Grid and GridFactory;
    }

    private bootstrapBlockFactory(){
        let blockLayerGroup: Phaser.Group = this._game.add.group();
        let blockFactory: BlockFactory = new BlockFactory(this._game, blockLayerGroup)
        this._systemModel.setBlockFactory(blockFactory);
    }




}