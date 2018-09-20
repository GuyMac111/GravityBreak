import { GridNode } from "./GridNode";
import { Dictionary } from "typescript-collections";
import { NodeMesh } from "./NodeMesh";

export class NodeMeshFactory{
    //Unfortunately have to keep a reference to the Dictionary here
    //Wanted to keep this stateless, but can't think of a way to associate the nodes without a ref
    //...Failure
    private _nodeMesh: Dictionary<Phaser.Point, GridNode>;
    private _spawnNodeMesh: Dictionary<Phaser.Point, GridNode>; 
    private _dimensionsInNodes: Phaser.Point;

    createNodeMesh(dimensionsInNodes: Phaser.Point): NodeMesh{
        this._dimensionsInNodes = dimensionsInNodes;
        this._nodeMesh = this.createUnassociatedNodeMesh(this._dimensionsInNodes);
        this._spawnNodeMesh = new Dictionary<Phaser.Point, GridNode>();
        this.associateNodeMesh(this._nodeMesh);
        return new NodeMesh(this._nodeMesh, this._spawnNodeMesh, this._dimensionsInNodes);
    }

    private createUnassociatedNodeMesh(_dimensionsInNodes: Phaser.Point): Dictionary<Phaser.Point, GridNode> {
        let toStr:(key:Phaser.Point) => string = (key:Phaser.Point) : string => {
            return `${key.x},${key.y}`;
        };
        
        let nodeMesh: Dictionary<Phaser.Point, GridNode> = new Dictionary<Phaser.Point, GridNode>(toStr);
        for(let i = 0; i<_dimensionsInNodes.x; i++){
            for(let j = 0; j<_dimensionsInNodes.y; j++){
                let node = new GridNode(new Phaser.Point(i,j));

                if(nodeMesh.containsKey(node.gridCoordinate)){
                    console.log("COLLISION");
                }

                nodeMesh.setValue(node.gridCoordinate, node);
            }
        }
        return nodeMesh;
    }

    private associateNodeMesh(unassociatedNodeMesh: Dictionary<Phaser.Point, GridNode>): void{
        //Loop through and link all of the created nodes to eachother
        unassociatedNodeMesh.forEach(this.associateNode.bind(this));
    }

    private associateNode(gridCoordinate: Phaser.Point, nodeToAssociate: GridNode): void {
        this.associateAbove(nodeToAssociate);
        this.associateBelow(nodeToAssociate);
        this.associateLeft(nodeToAssociate);
        this.associateRight(nodeToAssociate);
    }

    private associateAbove(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.y>0){
            //If it's not in the top row
            nodeToAssociate.nodeAbove = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y-1));
        }else{
            let spawnNodeLocation: Phaser.Point = new Phaser.Point(nodeToAssociate.gridCoordinate.x ,-1);
            this.createSecretSpawnNode(spawnNodeLocation);
        }
    }

    private associateBelow(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.y<this._dimensionsInNodes.y-1){
            //If it's not in the bottom row
            nodeToAssociate.nodeBelow = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x,nodeToAssociate.gridCoordinate.y+1));
        }else{
            let spawnNodeLocation: Phaser.Point = new Phaser.Point(nodeToAssociate.gridCoordinate.x ,this._dimensionsInNodes.y);
            this.createSecretSpawnNode(spawnNodeLocation);
        }
    }

    private associateLeft(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.x>0){
            //If it's not in the left-most row
            nodeToAssociate.nodeLeft = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x-1,nodeToAssociate.gridCoordinate.y));
        }else{
            let spawnNodeLocation: Phaser.Point = new Phaser.Point(-1 ,nodeToAssociate.gridCoordinate.y);
            this.createSecretSpawnNode(spawnNodeLocation);
        }
    }

    private associateRight(nodeToAssociate: GridNode): void {
        if(nodeToAssociate.gridCoordinate.x<this._dimensionsInNodes.x-1){
            //If it's not in the right-most row
            nodeToAssociate.nodeRight = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x+1,nodeToAssociate.gridCoordinate.y));
        }else{
            let spawnNodeLocation: Phaser.Point = new Phaser.Point(this._dimensionsInNodes.x ,nodeToAssociate.gridCoordinate.y);
            this.createSecretSpawnNode(spawnNodeLocation);
        }
    }

    private createSecretSpawnNode(nodeLocation: Phaser.Point): void{
        this._spawnNodeMesh.setValue(nodeLocation, new GridNode(nodeLocation));
    } 

}