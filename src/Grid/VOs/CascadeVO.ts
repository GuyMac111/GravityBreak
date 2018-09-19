import { BlockMediator } from "../../Block/BlockMediator";

export class CascadeVO{
    private _cascadingBlock: BlockMediator;
    private _destination: Phaser.Point;
    
    constructor(cascadingBlock: BlockMediator, destination: Phaser.Point){
        this._cascadingBlock = cascadingBlock;
        this._destination = destination;
    }
    
    get cascadingBlock():BlockMediator{
        return this._cascadingBlock;
    }
    
    get destination(): Phaser.Point {
        return this._destination;
    }
    
}
