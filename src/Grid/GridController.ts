import { Dictionary } from "typescript-collections";
import { GridNode } from "./GridNode";

export class GridController{
    private _dimensionsInNodes: Phaser.Point; 
    private _gridNodes: Dictionary<Phaser.Point, GridNode>;
    
    constructor(nodesHigh:number, nodesWide:number){
        this._dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
        this._gridNodes = new Dictionary<Phaser.Point, GridNode>();
        this.initialise();
    }

    private initialise(){
        for(let i = 0; i<this._dimensionsInNodes.x; i++){
            for(let j = 0; j<this._dimensionsInNodes.y; j++){
                let node = new GridNode(new Phaser.Point(i,j));
                this._gridNodes.setValue(node.gridCoordinate, node);
                console.log(`GridController::: Created node with point ${node.gridCoordinate.x},${node.gridCoordinate.y}`);
            }
        }
    }
}