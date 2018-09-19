import { ICascadeStrategy } from "./ICascadeStrategy";
import { SpawnData } from "./SpawnData";
import { GridNode } from "../Grid/GridNode";
import { Dictionary } from "typescript-collections";
import { Point } from "phaser";
import { NodeMesh } from "../Grid/NodeMesh";
import { CascadeVO } from "../Grid/VOs/CascadeVO";

export class DownCascadeStrategy implements ICascadeStrategy{
    private _nodeMesh: NodeMesh;

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
        let spawnNodeCoords: Phaser.Point = new Phaser.Point(destinationNode.gridCoordinate.x,-1);
        //-1 because it's the invisible 'SpawnNode' at the top;
        return new SpawnData(this._nodeMesh.spawnNodes.getValue(spawnNodeCoords), destinationNode)
    }

    private findNextUnoccupiedNode(): GridNode | undefined {
        //this is naughty and unperformant, but we're going to iterate through a dictionary here
        //using corrdinates just because we know they exist. This is because doing things this way will
        //open the way for us to do fruity block generation in the future. 
        for(let j = this._nodeMesh.dimensionsInNodes.y-1; j >= 0 ;j--){
            //counting backwards, as we wanna check from the bottom up
            let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInRow(j);
            if(potentiallyUnoccupiedNode != undefined){
                return potentiallyUnoccupiedNode;
            }
        }
        return undefined;
    }

    //hmmmm....could probably go into a base class???
    private getFirstUnoccupiedNodeInRow(j:number): GridNode | undefined{
        for(let i = 0; i<this._nodeMesh.dimensionsInNodes.x;i++) {
            let nodeToCheck: GridNode = this._nodeMesh.nodes.getValue(new Phaser.Point(i,j));
            if(!nodeToCheck.isOccupied){
                return nodeToCheck;
            }
        }
        return undefined;
    }

    get blocksToCascade(): CascadeVO[]{
        return this.getCascadeDataForGrid();
    }

    private getCascadeDataForGrid(): CascadeVO[]{
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
        let distanceToCascade: number = this.getNumberOfEmptyNodesBelowNode(node,0);
        if(node.isOccupied && distanceToCascade>0){
            let cascadeDestination: Phaser.Point = new Phaser.Point(node.gridCoordinate.x, node.gridCoordinate.y+distanceToCascade);
            let cascadeVO: CascadeVO = new CascadeVO(node.currentBlock, cascadeDestination);
            return cascadeVO;
        }else{
            return undefined;
        }
    }

    private getNumberOfEmptyNodesBelowNode(node:GridNode, emptyNodes: number): number{
        if(!node.isOccupied){
            emptyNodes++
        }
        if(node.nodeBelow!=undefined){
            return this.getNumberOfEmptyNodesBelowNode(node.nodeBelow,emptyNodes);
        }else{
            return emptyNodes;
        }
    }
}