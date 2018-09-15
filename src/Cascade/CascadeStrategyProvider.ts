import { ICascadeStrategy } from "./ICascadeStrategy";
import { Dictionary } from "typescript-collections";
import { GridNode } from "../Grid/GridNode";

export class CascadeStrategyProvider{
        
    constructor(nodeMesh: Dictionary<Phaser.Point, GridNode>){
        this.initialiseStrategies(nodeMesh);
        
    }
    
    // get cascadeStrategy(): ICascadeStrategy{

    // }

    private initialiseStrategies(nodeMesh: Dictionary<Phaser.Point, GridNode>): void{
        //TODO
        
    }
}