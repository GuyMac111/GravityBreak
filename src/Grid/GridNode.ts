export class GridNode{
    private _gridCoordinate: Phaser.Point;
    nodeAbove: GridNode;
    nodeBelow: GridNode;
    nodeLeft: GridNode;
    nodeRight: GridNode;

    constructor(gridCoordinate: Phaser.Point){
        this._gridCoordinate = new Phaser.Point(gridCoordinate.x,gridCoordinate.y);
    }

    get gridCoordinate(): Phaser.Point{
        return this._gridCoordinate;
    }
}