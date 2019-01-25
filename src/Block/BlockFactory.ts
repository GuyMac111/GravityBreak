import { BlockMediator } from "./BlockMediator"
import { BlockView } from "./BlockView"
import { BlockColour } from "./BlockColour";
import { EventHub } from "../System/Events/EventHub";
import { IGameConfigModel } from "../System/Config/GameConfigModel";

export class BlockFactory{
    private _game: Phaser.Game;
    private _blocksLayerGroup: Phaser.Group;
    private _eventHub: EventHub;
    private _gameConfig: IGameConfigModel;
    
    //We're going to use this starting point to setup BlockMediators and Views.
    //with absolutely everything they need.
    //It's also going to substitute as a VERY hamfisted Dependency Injector for those classes.
    //But as it also needs an instance of game, it's also going to need to be "injected" with "game".
    constructor(game: Phaser.Game, blockLayerGroup: Phaser.Group, injectedEventHub: EventHub, gameConfig: IGameConfigModel){
        this._game = game;
        this._blocksLayerGroup = blockLayerGroup;
        this._eventHub = injectedEventHub;
        this._gameConfig = gameConfig;
    }

    createBlockAtPosition(startingPosition: Phaser.Point): BlockMediator {
        let view: BlockView = this.createBlockView();
        let mediator: BlockMediator = new BlockMediator(startingPosition, this.generateRandomColour(), view, this._eventHub, this._gameConfig);
        return mediator;
    }

    private generateRandomColour(): BlockColour{
        //hacky solution for randomising between enum values. WILL fail on string enums.
        let numEnumValues: number = this._gameConfig.blockSprites.length;
        let randomEnumInt: number = Math.floor(Math.random()*numEnumValues);
        return randomEnumInt;
    }

    private createBlockView(): BlockView {
        let blockView = new BlockView(this._game, this._blocksLayerGroup, this._gameConfig);
        return blockView;
    }
}