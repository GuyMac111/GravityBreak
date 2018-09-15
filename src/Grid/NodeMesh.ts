import { GridNode } from "./GridNode";
import { Dictionary } from "typescript-collections";

//A class which contains all the associated nodes of a grid 
//as well as the hidden 'spawn nodes' of said grid in a separate dict
export class NodeMesh{
    private _nodes: Dictionary<Phaser.Point, GridNode>;
    private _spawnNodes: Dictionary<Phaser.Point, GridNode>;
    private _dimensionsInNodes: Phaser.Point;

    constructor(nodes: Dictionary<Phaser.Point, GridNode>, spawnNodes: Dictionary<Phaser.Point, GridNode>, dimensionsInNodes: Phaser.Point){
        this._nodes = nodes;
        this._spawnNodes = spawnNodes;
        this._dimensionsInNodes = dimensionsInNodes;
    }

    get nodes(): Dictionary<Phaser.Point, GridNode>{
        return this._nodes;
    }

    get spawnNodes(): Dictionary<Phaser.Point, GridNode>{
        return this._spawnNodes;
    }

    get dimensionsInNodes(): Phaser.Point{
        return this._dimensionsInNodes;
    }

}