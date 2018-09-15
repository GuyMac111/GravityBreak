import { NodeMeshFactory } from "./NodeMeshFactory";
import { NodeMesh } from "./NodeMesh";

export class GridController{
    private _gridNodes: NodeMesh;
    
    constructor(nodesHigh:number, nodesWide:number){
        //Given more time, the NodeMesh would be an object, instantiated & injected via a factory defined within the context.
        let factory: NodeMeshFactory = new NodeMeshFactory();
        let dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
        this._gridNodes = factory.createNodeMesh(dimensionsInNodes);
    }

    //TODO: using strategy provider we should now attempt filling the grid.

    
}