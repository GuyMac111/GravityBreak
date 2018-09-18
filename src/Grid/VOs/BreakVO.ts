export class BreakVO{
    private _coords: Phaser.Point[];
    constructor(coords: Phaser.Point[]){
        this._coords = coords;
    }

    get coords(): Phaser.Point[]{
        return this._coords;
    }
}