import { BaseCascadeStrategy } from "./BaseCascadeStrategy";
import { NodeMesh } from "../Grid/NodeMesh";
import { GridNode } from "../Grid/GridNode";

export class LeftCascadeStrategy extends BaseCascadeStrategy{
    constructor(nodeMesh: NodeMesh){
        super(nodeMesh);
    }

    protected getSpawnCoordForNode(node: GridNode): Phaser.Point{
        //y = max as we want to spawn from the bottom.
        return new Phaser.Point(this._nodeMesh.dimensionsInNodes.x, node.gridCoordinate.y);
    }

    protected findNextUnoccupiedNode(): GridNode | undefined {
        for(let j = 0; j < this._nodeMesh.dimensionsInNodes.y ;j++){
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
        if(node.nodeLeft!=undefined){
            return this.getNumberOfEmptyNodesInCascadePath(node.nodeLeft,emptyNodesSoFar);
        }else{
            return emptyNodesSoFar;
        }
    }

    protected getCascadeDestinationForNode(node: GridNode, distanceToCascade: number): Phaser.Point{
        return new Phaser.Point(node.gridCoordinate.x-distanceToCascade, node.gridCoordinate.y);
    }
}
