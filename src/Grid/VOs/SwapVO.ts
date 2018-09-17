export class SwapVO{
    private _firstBlockCoord: Phaser.Point;
    private _secondBlockCoord: Phaser.Point;
    
    constructor(firstBlockCoord: Phaser.Point, secondBlockCoord: Phaser.Point){
        this._firstBlockCoord = firstBlockCoord;
        this._secondBlockCoord = secondBlockCoord;    
    }

    get firstBlockCoord(): Phaser.Point{
        return this._firstBlockCoord;
    }

    get secondBlockCoord(): Phaser.Point{
        return this._secondBlockCoord;
    }
}
