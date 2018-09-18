import { NodeMesh } from "./NodeMesh";
import { GridNode } from "./GridNode";
import { BreakVO } from "./VOs/BreakVO";
import { BlockColour } from "../Block/BlockColour";
import { Set } from "typescript-collections";
import { EventHub } from "../System/Events/EventHub";
import { EventHandler } from "../System/Events/EventHandler";
import { GridEvents } from "./GridEvents";

export class GridEvaluator extends EventHandler{

    constructor(injectedEventHub: EventHub){
        super(injectedEventHub);
        this.addEventListener(GridEvents.EvaluateGridEvent, this.onEvaluateGridEvent.bind(this));
    }

    private onEvaluateGridEvent(message?:any): void{
        if(message instanceof NodeMesh){
            this.evaluateGrid(message);
        }
    }

    private evaluateGrid(nodeMesh: NodeMesh): void{
        let breakVOs: BreakVO[] = [];
        let nodeMeshToEvaluate: NodeMesh = nodeMesh
        nodeMeshToEvaluate.nodes.forEach((point:Phaser.Point, node: GridNode)=>{
            this.evaluateNode(node, breakVOs);
        });
        if(breakVOs.length>0){
            console.log("GridEvaluator::: WE GOT BREAKS")
        }else{
            console.log("GridEvaluator::: NO BREAKS")
        }
    }

    private evaluateNode(gridNode: GridNode, breakVOs:BreakVO[]){
        if(this.nodeExistsInExistingBreak(gridNode,breakVOs)){
            return;
        }
        let totalVerticalBreak: GridNode[] = this.searchAboveNode(gridNode.nodeAbove, [gridNode]).concat(this.searchBelowNode(gridNode.nodeBelow, [gridNode]));
        let totalHorizontalBreak: GridNode[] = this.searchLeftNode(gridNode.nodeLeft,[gridNode]).concat(this.searchRightNode(gridNode.nodeRight, [gridNode]));
        let set:Set<Phaser.Point> = new Set<Phaser.Point>();
        //substract 1 in the length check because their WILL be 1 duplicate in the array
        if(totalHorizontalBreak.length >= 3){
            totalHorizontalBreak.forEach(element => {
                set.add(element.gridCoordinate);
            });
        }
        if(totalVerticalBreak.length >= 3){
            totalVerticalBreak.forEach(element => {
                set.add(element.gridCoordinate);
            });
        }
        if(set.size()>0){
            breakVOs.push(new BreakVO(set.toArray()));
        }
        //subtract 1 because the original node will be a duplicate
    }

    private nodeExistsInExistingBreak(gridNode: GridNode, breakVOs:BreakVO[]): boolean{
        for(let i: number= 0; i<breakVOs.length; i++){
            if(breakVOs[i].coords.indexOf(gridNode.gridCoordinate)>-1){
                return true;
            }
        }
        return false;
    }

    private searchAboveNode(matchGridNode:GridNode, matchedSoFar:GridNode[]):GridNode[]{
        if(matchGridNode==undefined||!matchGridNode.isOccupied){
            //if this node is unoccupied return what we've got so far.
            return matchedSoFar;
        }
        if(matchGridNode.currentBlock.blockColour == matchedSoFar[0].currentBlock.blockColour){
            //if this node matches so far, add it.
            matchedSoFar.push(matchGridNode);
        }else{
            //if this node doesn't match, this chain is over.
            return matchedSoFar;
        }
        if(matchGridNode.nodeAbove == undefined){
            //if we hit the boundary, return what we've got so far.
            return matchedSoFar;
        }else{
            //if not keep going up
            return this.searchAboveNode(matchGridNode.nodeAbove, matchedSoFar);
        }
    }

    private searchBelowNode(matchGridNode:GridNode, matchedSoFar:GridNode[]):GridNode[]{
        try{
            if(matchGridNode==undefined||!matchGridNode.isOccupied){
                //if this node is unoccupied return what we've got so far.
                return matchedSoFar;
            }
            if(matchGridNode.currentBlock.blockColour == matchedSoFar[0].currentBlock.blockColour){
                //if this node matches so far, add it.
                matchedSoFar.push(matchGridNode);
            }else{
                //if this node doesn't match, this chain is over.
                return matchedSoFar;
            }
            if(matchGridNode.nodeBelow == undefined){
                //if we hit the boundary, return what we've got so far.
                return matchedSoFar;
            }else{
                //if not keep going up
                return this.searchBelowNode(matchGridNode.nodeBelow, matchedSoFar);
            }

        }catch(e){
            console.log(e);
        }
    }

    private searchLeftNode(matchGridNode:GridNode, matchedSoFar:GridNode[]):GridNode[]{
        if(matchGridNode==undefined||!matchGridNode.isOccupied){
            //if this node is unoccupied return what we've got so far.
            return matchedSoFar;
        }
        if(matchGridNode.currentBlock.blockColour == matchedSoFar[0].currentBlock.blockColour){
            //if this node matches so far, add it.
            matchedSoFar.push(matchGridNode);
        }else{
            //if this node doesn't match, this chain is over.
            return matchedSoFar;
        }
        if(matchGridNode.nodeLeft == undefined){
            //if we hit the boundary, return what we've got so far.
            return matchedSoFar;
        }else{
            //if not keep going up
            return this.searchLeftNode(matchGridNode.nodeLeft, matchedSoFar);
        }
    }

    private searchRightNode(matchGridNode:GridNode, matchedSoFar:GridNode[]):GridNode[]{
        if(matchGridNode==undefined||!matchGridNode.isOccupied){
            //if this node is unoccupied return what we've got so far.
            return matchedSoFar;
        }
        if(matchGridNode.currentBlock.blockColour == matchedSoFar[0].currentBlock.blockColour){
            //if this node matches so far, add it.
            matchedSoFar.push(matchGridNode);
        }else{
            //if this node doesn't match, this chain is over.
            return matchedSoFar;
        }
        if(matchGridNode.nodeRight == undefined){
            //if we hit the boundary, return what we've got so far.
            return matchedSoFar;
        }else{
            //if not keep going up
            return this.searchRightNode(matchGridNode.nodeRight, matchedSoFar);
        }
    }
}