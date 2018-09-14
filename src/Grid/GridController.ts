import { Dictionary } from "typescript-collections";
import { GridNode } from "./GridNode";

export class GridController{
    private _dimensionsInNodes: Phaser.Point; 
    private _gridNodes: Dictionary<Phaser.Point, GridNode>;
    
    constructor(nodesHigh:number, nodesWide:number){
        this._dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
        this._gridNodes = new Dictionary<Phaser.Point, GridNode>();
        this.initialise();
        this.associateGridNodes();
    }

    private initialise(): void {
        for(let i = 0; i<this._dimensionsInNodes.x; i++){
            for(let j = 0; j<this._dimensionsInNodes.y; j++){
                let node = new GridNode(new Phaser.Point(i,j));
                this._gridNodes.setValue(node.gridCoordinate, node);
                console.log(`GridController::: Created node with grid location ${node.gridCoordinate.x},${node.gridCoordinate.y}`);
            }
        }
    }

    private associateGridNodes(): void{
        this._gridNodes.forEach(this.associateNode.bind(this));
        // this._gridNodes.forEach()

    }

    private associateNode(gridCoordinate: Phaser.Point, nodeToAssociate: GridNode): void {
        console.log(`GridController::: Associating node at ${nodeToAssociate.gridCoordinate}`);
        this.associateAbove(nodeToAssociate);
        this.associateBelow(nodeToAssociate);
        this.associateLeft(nodeToAssociate);
        this.associateRight(nodeToAssociate);
    }
    
    associateAbove(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.y>0){
            //If it's not in the top row
            nodeToAssociate.nodeAbove = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x,nodeToAssociate.gridCoordinate.y-1));
            console.log(`GridController::: The node above node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
        }else{
            console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is at the top. So no above node associated`);
        }
    }

    associateBelow(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.y<this._dimensionsInNodes.y-1){
            //If it's not in the bottom row
            nodeToAssociate.nodeBelow = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x,nodeToAssociate.gridCoordinate.y+1));
            console.log(`GridController::: The node below node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeBelow.gridCoordinate}`);
        }else{
            console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is at the bottom. So no below node associated`);
        }
    }

    associateLeft(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.x>0){
            //If it's not in the left-most row
            nodeToAssociate.nodeLeft = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x-1,nodeToAssociate.gridCoordinate.y));
            console.log(`GridController::: The node to the left of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeLeft.gridCoordinate}`);
        }else{
            console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is flush to the left. So no node associated`);
        }
    }

    associateRight(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.x<this._dimensionsInNodes.x-1){
            //If it's not in the right-most row
            nodeToAssociate.nodeAbove = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x+1,nodeToAssociate.gridCoordinate.y));
            console.log(`GridController::: The node to the right of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
        }else{
            console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is flush to the right. So no node associated`);
        }
    }
}