import { BlockMediator } from "./BlockMediator"
import { BlockView } from "./BlockView"

export class BlockFactory{
    _game: Phaser.Game;
    _blocksLayerGroup: Phaser.Group;
    
    //We're going to use this starting point to setup BlockMediators and Views.
    //with absolutely everything they need.
    //It's also going to substitute as a VERY hamfisted Dependency Injector for those classes.
    //But as it also needs an instance of game, it's also going to need to be "injected" with "game".
    constructor(game: Phaser.Game, blockLayerGroup: Phaser.Group){
        this._game = game;
        this._blocksLayerGroup = blockLayerGroup;
    }

    createBlockAtPosition(startingPosition: Phaser.Point): BlockMediator {
        let view: BlockView = this.createBlockView();
        let mediator: BlockMediator = new BlockMediator(startingPosition, view) 
        return mediator;
    }

    private createBlockView(): BlockView {
        let blockView = new BlockView(this._game, this._blocksLayerGroup);
        return blockView;
    }
}