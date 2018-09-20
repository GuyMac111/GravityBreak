import { BlockMediator } from "../Block/BlockMediator";

export class GridNode{
    private _gridCoordinate: Phaser.Point;

    private _currentBlock: BlockMediator;
    private _nodeAbove: GridNode = undefined;
    private _nodeBelow: GridNode = undefined;
    private _nodeLeft: GridNode = undefined;
    private _nodeRight: GridNode = undefined;

    constructor(gridCoordinate: Phaser.Point){
        this._gridCoordinate = new Phaser.Point(gridCoordinate.x,gridCoordinate.y);
    }

    releaseBlock(): void {
        this._currentBlock.currentNode = undefined;
        this._currentBlock = undefined;
        console.log(`node ${this._gridCoordinate} released it's block.`);
    }

    assignBlock(block: BlockMediator): void{
        this._currentBlock = block;
        this._currentBlock.currentNode = this;
        console.log(`Assigned node ${this._gridCoordinate} block: \n${this._currentBlock}`);
    }

    getCurrentBlock():BlockMediator{
        return this._currentBlock;
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
        return this._currentBlock != undefined;
    }
}