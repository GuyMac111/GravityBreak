import { ICascadeStrategy } from "./ICascadeStrategy";
import { NodeMesh } from "../Grid/NodeMesh";
import { GridNode } from "../Grid/GridNode";
import { SpawnData } from "./SpawnData";
import { CascadeVO } from "../Grid/VOs/CascadeVO";

export class BaseCascadeStrategy implements ICascadeStrategy{
    protected _nodeMesh: NodeMesh;

    constructor(nodeMesh: NodeMesh){
        this._nodeMesh = nodeMesh;
    }
    
    get shouldSpawnBlock(): boolean{
        return this.findNextUnoccupiedNode() != undefined;
    }

    get nextSpawn(): SpawnData{
        let destinationNode: GridNode = this.findNextUnoccupiedNode();
        if(destinationNode==undefined){
            throw new Error(`Something went wrong. Searching the grid for next unoccupied node to spawn to, but we got undefined`);
        }
        let spawnNodeCoords: Phaser.Point = this.getSpawnCoordForNode(destinationNode);
        //-1 because it's the invisible 'SpawnNode' at the top;
        return new SpawnData(this._nodeMesh.spawnNodes.getValue(spawnNodeCoords), destinationNode)
    }

    protected getSpawnCoordForNode(node: GridNode): Phaser.Point{
        throw new Error("Override in child class");
    }

    protected findNextUnoccupiedNode(): GridNode | undefined {
        throw new Error("Override in child class");   
    }

    protected getFirstUnoccupiedNodeInRow(row: number): GridNode | undefined{
        for(let i = 0; i<this._nodeMesh.dimensionsInNodes.x;i++) {
            let nodeToCheck: GridNode = this._nodeMesh.nodes.getValue(new Phaser.Point(i,row));
            if(!nodeToCheck.isOccupied){
                return nodeToCheck;
            }
        }
        return undefined;
    }

    protected getFirstUnoccupiedNodeInColumn(column: number): GridNode | undefined{
        for(let j = 0; j<this._nodeMesh.dimensionsInNodes.y;j++) {
            let nodeToCheck: GridNode = this._nodeMesh.nodes.getValue(new Phaser.Point(column,j));
            if(!nodeToCheck.isOccupied){
                return nodeToCheck;
            }
        }
        return undefined;
    }

    get blocksToCascade(): CascadeVO[]{
        return this.getCascadeDataForGrid();
    }

    protected getCascadeDataForGrid(): CascadeVO[]{
        let result: CascadeVO[] = [];
        this._nodeMesh.nodes.forEach((coord:Phaser.Point, node:GridNode):void=>{
            let cascadeDataForNode: CascadeVO = this.getCascadeDataForNode(node);
            if(cascadeDataForNode!=undefined){
                result.push(cascadeDataForNode);
            }
        });
        return result;
    }

    private getCascadeDataForNode(node: GridNode): CascadeVO{
        let distanceToCascade: number = this.getNumberOfEmptyNodesInCascadePath(node,0);
        if(node.isOccupied){
            let cascadeDestination: Phaser.Point = this.getCascadeDestinationForNode(node, distanceToCascade);
            let cascadeVO: CascadeVO = new CascadeVO(node.getCurrentBlock(), cascadeDestination);
            return cascadeVO;
        }else{
            return undefined;
        }
    }

    protected getNumberOfEmptyNodesInCascadePath(node: GridNode, emptyNodesSoFar: number): number{
        throw new Error("Override in child class");
    }

    protected getCascadeDestinationForNode(node: GridNode, distanceToCascade: number): Phaser.Point{
        throw new Error("Override in child class");
    }
}