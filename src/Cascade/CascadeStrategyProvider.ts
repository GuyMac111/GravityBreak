import { ICascadeStrategy } from "./ICascadeStrategy";
import { Dictionary } from "typescript-collections";
import { GridNode } from "../Grid/GridNode";
import { NodeMesh } from "../Grid/NodeMesh";
import { DownCascadeStrategy } from "./DownCascadeStrategy";

export class CascadeStrategyProvider{

    private _downwardStrategy: DownCascadeStrategy;
        
    constructor(nodeMesh: NodeMesh){
        this.initialiseStrategies(nodeMesh);
    }
    
    get cascadeStrategy(): ICascadeStrategy{
        return this._downwardStrategy;    
    }

    private initialiseStrategies(nodeMesh: NodeMesh): void{
        this._downwardStrategy = new DownCascadeStrategy(nodeMesh);        
    }
}