import { GridNode } from "../Grid/GridNode";
import { NodeMesh } from "../Grid/NodeMesh";
import { BaseCascadeStrategy } from "./BaseCascadeStrategy";

export class DownCascadeStrategy extends BaseCascadeStrategy{

    constructor(nodeMesh: NodeMesh){
        super(nodeMesh);
    }

    protected getSpawnCoordForNode(node: GridNode): Phaser.Point{
        //y = -1 as we want to spawn from the top.
        return new Phaser.Point(node.gridCoordinate.x, -1);
    }

    protected findNextUnoccupiedNode(): GridNode | undefined {
        for(let j = this._nodeMesh.dimensionsInNodes.y-1; j >= 0 ;j--){
            //counting backwards, as we wanna check from the bottom up
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
        if(node.nodeBelow!=undefined){
            return this.getNumberOfEmptyNodesInCascadePath(node.nodeBelow,emptyNodesSoFar);
        }else{
            return emptyNodesSoFar;
        }
    }

    protected getCascadeDestinationForNode(node: GridNode, distanceToCascade: number): Phaser.Point{
        return new Phaser.Point(node.gridCoordinate.x, node.gridCoordinate.y+distanceToCascade);
    }
}