import { NodeMesh } from "../Grid/NodeMesh";
import { BaseCascadeStrategy } from "./BaseCascadeStrategy";
import { GridNode } from "../Grid/GridNode";

export class UpCascadeStrategy extends BaseCascadeStrategy{

    constructor(nodeMesh: NodeMesh){
        super(nodeMesh);
    }

    protected getSpawnCoordForNode(node: GridNode): Phaser.Point{
        //y = max as we want to spawn from the bottom.
        return new Phaser.Point(node.gridCoordinate.x, this._nodeMesh.dimensionsInNodes.y);
    }

    protected findNextUnoccupiedNode(): GridNode | undefined {
        for(let j = 0; j < this._nodeMesh.dimensionsInNodes.y;j++){
            //counting forwards, as we wanna check from the top down
            let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInRow(j);
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
        if(node.nodeAbove!=undefined){
            return this.getNumberOfEmptyNodesInCascadePath(node.nodeAbove,emptyNodesSoFar);
        }else{
            return emptyNodesSoFar;
        }
    }

    protected getCascadeDestinationForNode(node: GridNode, distanceToCascade: number): Phaser.Point{
        return new Phaser.Point(node.gridCoordinate.x, node.gridCoordinate.y-distanceToCascade);
    }

}