import { Mediator } from "../System/Mediator";
import { BlockView } from "./BlockView";

export class BlockMediator extends Mediator{
    private _blockView: BlockView;

    constructor(startingGridPosition: Phaser.Point ,injectedView:BlockView){
        super(injectedView);
        this._blockView = this.view;
        
    }
}