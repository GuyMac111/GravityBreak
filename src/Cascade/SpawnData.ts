import { GridNode } from "../Grid/GridNode";

export class SpawnData{
    private _spawnNode: GridNode;
    private _destinationNode: GridNode;

    constructor(spawnNode: GridNode, destinationNode: GridNode){
            this._destinationNode = destinationNode;
            this._spawnNode = spawnNode;
    }

    get destination(): GridNode{
        return this._destinationNode;
    }

    get spawnNode(): GridNode{
        return this._spawnNode;
    }
}