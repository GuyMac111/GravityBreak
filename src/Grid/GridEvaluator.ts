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
        if(this.nodeExistsInExistingBreak(gridNode,breakVOs)||gridNode.currentBlock==undefined){
            return;
        }
        let colour: BlockColour = gridNode.currentBlock.blockColour;
        let totalVerticalBreak: GridNode[] = this.searchAboveNode(gridNode.nodeAbove,[], colour).concat(this.searchBelowNode(gridNode.nodeBelow, [], colour)).concat(gridNode);
        let totalHorizontalBreak: GridNode[] = this.searchLeftNode(gridNode.nodeLeft,[], colour).concat(this.searchRightNode(gridNode.nodeRight, [], colour)).concat(gridNode);
        let set:Set<Phaser.Point> = new Set<Phaser.Point>();
        
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
            this.addToBreakVOs(new BreakVO(set), breakVOs);
        }
    }

    private nodeExistsInExistingBreak(gridNode: GridNode, breakVOs:BreakVO[]): boolean{
        for(let i: number= 0; i<breakVOs.length; i++){
            if(breakVOs[i].coords.contains(gridNode.gridCoordinate)){
                return true;
            }
        }
        return false;
    }

    private addToBreakVOs(voToAdd: BreakVO, breakVos: BreakVO[]): void{
        for(let i:number = 0; i<breakVos.length; i++){
            if(this.breakVOsIntersect(voToAdd, breakVos[i])){
                //Before we add it to the list of breakVOs
                //check that we can't merge it with another instead. 
                //To avoid duplicates in the payload which we send.
                breakVos[i].coords.union(voToAdd.coords);
                return;
            }
        }
        breakVos.push(voToAdd);
    }

    private breakVOsIntersect(first: BreakVO, second:BreakVO): boolean{
        for(let i:number = 0; i < first.coords.toArray().length;i++){
            if(second.coords.contains(first.coords.toArray()[i])){
                return true;
            }
        }
        return false;
    }

    private searchAboveNode(matchGridNode:GridNode, matchedSoFar:GridNode[], colour: BlockColour):GridNode[]{
        if(matchGridNode==undefined||!matchGridNode.isOccupied){
            //if this node is unoccupied return what we've got so far.
            return matchedSoFar;
        }
        if(matchGridNode.currentBlock.blockColour == colour){
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
            return this.searchAboveNode(matchGridNode.nodeAbove, matchedSoFar, colour);
        }
    }

    private searchBelowNode(matchGridNode:GridNode, matchedSoFar:GridNode[], colour: BlockColour):GridNode[]{
        try{
            if(matchGridNode==undefined||!matchGridNode.isOccupied){
                //if this node is unoccupied return what we've got so far.
                return matchedSoFar;
            }
            if(matchGridNode.currentBlock.blockColour == colour){
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
                //if not keep going down
                return this.searchBelowNode(matchGridNode.nodeBelow, matchedSoFar, colour);
            }

        }catch(e){
            console.log(e);
        }
    }

    private searchLeftNode(matchGridNode:GridNode, matchedSoFar:GridNode[], colour: BlockColour):GridNode[]{
        if(matchGridNode==undefined||!matchGridNode.isOccupied){
            //if this node is unoccupied return what we've got so far.
            return matchedSoFar;
        }
        if(matchGridNode.currentBlock.blockColour == colour){
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
            //if not keep going left
            return this.searchLeftNode(matchGridNode.nodeLeft, matchedSoFar, colour);
        }
    }

    private searchRightNode(matchGridNode:GridNode, matchedSoFar:GridNode[], colour: BlockColour):GridNode[]{
        if(matchGridNode==undefined||!matchGridNode.isOccupied){
            //if this node is unoccupied return what we've got so far.
            return matchedSoFar;
        }
        if(matchGridNode.currentBlock.blockColour == colour){
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
            //if not keep going right
            return this.searchRightNode(matchGridNode.nodeRight, matchedSoFar, colour);
        }
    }
}