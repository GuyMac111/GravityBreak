import { Dictionary } from "typescript-collections";
import { GridNode } from "./GridNode";
import { NodeMeshFactory } from "./NodeMeshFactory";

export class GridController{
    private _dimensionsInNodes: Phaser.Point; 
    private _gridNodes: Dictionary<Phaser.Point, GridNode>;
    
    constructor(nodesHigh:number, nodesWide:number){
        let factory: NodeMeshFactory = new NodeMeshFactory();
        this._dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
        this._gridNodes = factory.createNodeMeshOfDimensions(this._dimensionsInNodes);
    }

    
}