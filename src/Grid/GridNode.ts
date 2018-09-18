import { BlockMediator } from "../Block/BlockMediator";

export class GridNode{
    private _gridCoordinate: Phaser.Point;

    currentBlock: BlockMediator;
    private _nodeAbove: GridNode = undefined;
    private _nodeBelow: GridNode = undefined;
    private _nodeLeft: GridNode = undefined;
    private _nodeRight: GridNode = undefined;

    private _numTimesAboveSet:number = 0;

    constructor(gridCoordinate: Phaser.Point){
        this._gridCoordinate = new Phaser.Point(gridCoordinate.x,gridCoordinate.y);
    }

    get nodeAbove(): GridNode{
        return this._nodeAbove;
    }

    get nodeBelow(): GridNode{
        return this._nodeBelow;
    }

    get nodeLeft(): GridNode{
        return this._nodeLeft;
    }

    get nodeRight(): GridNode{
        return this._nodeRight;
    }

    set nodeAbove(node: GridNode){
        if(this._numTimesAboveSet>0){
            console.log(`HERE!!!!! ${this._gridCoordinate}`);
        }
        this._numTimesAboveSet++;
        this._nodeAbove = node;
    }
    set nodeBelow(node: GridNode){
        this._nodeBelow = node;
    }
    set nodeLeft(node: GridNode){
        this._nodeLeft = node;
    }
    set nodeRight(node: GridNode){
        this._nodeRight = node;
    }

    get gridCoordinate(): Phaser.Point{
        return this._gridCoordinate;
    }

    get isOccupied(): boolean{
        return this.currentBlock != undefined;
    }
}