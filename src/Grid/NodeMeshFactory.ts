import { GridNode } from "./GridNode";
import { Dictionary } from "typescript-collections";

export class NodeMeshFactory{
    //Unfortunately have to keep a reference to the Dictionary here
    //Wanted to keep this stateless, but can't think of a way to associate the nodes without a ref
    //...Failure
    private _nodeMesh:Dictionary<Phaser.Point, GridNode>;
    private _dimensionsInNodes: Phaser.Point;

    createNodeMeshOfDimensions(dimensionsInNodes: Phaser.Point): Dictionary<Phaser.Point, GridNode>{
        this._dimensionsInNodes = dimensionsInNodes;
        this._nodeMesh = this.createUnassociatedNodeMesh(this._dimensionsInNodes);
        this.associateNodeMesh(this._nodeMesh);
        return this._nodeMesh;
    }

    private createUnassociatedNodeMesh(_dimensionsInNodes: Phaser.Point): Dictionary<Phaser.Point, GridNode> {
        let nodeMesh: Dictionary<Phaser.Point, GridNode> = new Dictionary<Phaser.Point, GridNode>();
        for(let i = 0; i<_dimensionsInNodes.x; i++){
            for(let j = 0; j<_dimensionsInNodes.y; j++){
                let node = new GridNode(new Phaser.Point(i,j));
                nodeMesh.setValue(node.gridCoordinate, node);
                console.log(`NodeMeshFactory::: Created node with grid location ${node.gridCoordinate.x},${node.gridCoordinate.y}`);
            }
        }
        return nodeMesh;
    }

    private associateNodeMesh(unassociatedNodeMesh: Dictionary<Phaser.Point, GridNode>): void{
        //Loop through and link all of the created nodes to eachother
        unassociatedNodeMesh.forEach(this.associateNode.bind(this));
    }

    private associateNode(gridCoordinate: Phaser.Point, nodeToAssociate: GridNode): void {
        console.log(`NodeMeshFactory::: Associating node at ${nodeToAssociate.gridCoordinate}`);
        this.associateAbove(nodeToAssociate);
        this.associateBelow(nodeToAssociate);
        this.associateLeft(nodeToAssociate);
        this.associateRight(nodeToAssociate);
    }

    private associateAbove(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.y>0){
            //If it's not in the top row
            nodeToAssociate.nodeAbove = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x,nodeToAssociate.gridCoordinate.y-1));
            console.log(`NodeMeshFactory::: The node above node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
        }else{
            console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is at the top. So no above node associated`);
        }
    }

    private associateBelow(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.y<this._dimensionsInNodes.y-1){
            //If it's not in the bottom row
            nodeToAssociate.nodeBelow = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x,nodeToAssociate.gridCoordinate.y+1));
            console.log(`NodeMeshFactory::: The node below node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeBelow.gridCoordinate}`);
        }else{
            console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is at the bottom. So no below node associated`);
        }
    }

    private associateLeft(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.x>0){
            //If it's not in the left-most row
            nodeToAssociate.nodeLeft = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x-1,nodeToAssociate.gridCoordinate.y));
            console.log(`NodeMeshFactory::: The node to the left of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeLeft.gridCoordinate}`);
        }else{
            console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is flush to the left. So no node associated`);
        }
    }

    private associateRight(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.x<this._dimensionsInNodes.x-1){
            //If it's not in the right-most row
            nodeToAssociate.nodeAbove = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x+1,nodeToAssociate.gridCoordinate.y));
            console.log(`NodeMeshFactory::: The node to the right of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
        }else{
            console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is flush to the right. So no node associated`);
        }
    }

}