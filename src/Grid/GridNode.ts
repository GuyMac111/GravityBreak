export class GridNode{
    private _gridCoordinate: Phaser.Point;

    constructor(gridCoordinate: Phaser.Point){
        this._gridCoordinate = new Phaser.Point(gridCoordinate.x,gridCoordinate.y);
    }

    get gridCoordinate(): Phaser.Point{
        return this._gridCoordinate;
    }
}