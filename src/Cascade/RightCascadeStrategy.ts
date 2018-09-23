import { NodeMesh } from "../Grid/NodeMesh";
import { BaseCascadeStrategy } from "./BaseCascadeStrategy";
import { GridNode } from "../Grid/GridNode";

export class RightCascadeStrategy extends BaseCascadeStrategy{
    constructor(nodeMesh: NodeMesh){
        super(nodeMesh);
    }

    protected getSpawnCoordForNode(node: GridNode): Phaser.Point{
        //y = max as we want to spawn from the bottom.
        return new Phaser.Point(-1, node.gridCoordinate.y);
    }

    protected findNextUnoccupiedNode(): GridNode | undefined {
        for(let j = this._nodeMesh.dimensionsInNodes.y-1; j >= 0 ;j--){
            //counting forwards, as we wanna check from the top down
            let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInColumn(j);
            if(potentiallyUnoccupiedNode != undefined){
                return potentiallyUnoccupiedNode;
            }
        }
        return undefined;
    }

    protected getNumberOfEmptyNodesInCascadePath(node: GridNode, emptyNodesSoFar: number): number{
        if(!node.isOccupied){
            emptyNodesSoFar++
        }
        if(node.nodeRight!=undefined){
            return this.getNumberOfEmptyNodesInCascadePath(node.nodeRight,emptyNodesSoFar);
        }else{
            return emptyNodesSoFar;
        }
    }

    protected getCascadeDestinationForNode(node: GridNode, distanceToCascade: number): Phaser.Point{
        return new Phaser.Point(node.gridCoordinate.x+distanceToCascade, node.gridCoordinate.y);
    }
    
}