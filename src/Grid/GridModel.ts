import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { GridEvents } from "./GridEvents";
import { SwapVO } from "./VOs/SwapVO";
import { NodeMesh } from "./NodeMesh";

export class GridModel extends EventHandler{
    //hmmmmmm.... Maybe 'InputModel' insted???
    private _currentlySelectedCoord: Phaser.Point;
    private _swapCandidateCoord: Phaser.Point;
    private _selectedBlockSwapAnimationComplete: boolean = false;
    private _swapCandidateBlockSwapAnimationComplete: boolean = false;
    private _gridEvaluationInProgress: boolean = false;

    constructor(injectedEventHub: EventHub){
        super(injectedEventHub);
    }

    get hasCurrentlySelectedBlock():  boolean{
        return this._currentlySelectedCoord != undefined;
    }

    set currentlySelectedCoord(coord: Phaser.Point){
        if(this._currentlySelectedCoord==undefined){
            this._currentlySelectedCoord = coord;
            this.dispatchEvent(GridEvents.ShowBlockSelectedEvent, this._currentlySelectedCoord);
        }else{
            console.log("GridModel.set currentlySelectedCoord::: Something went wrong. Why are we trying to set the currSelectedCoord when there's already one?");
        }
    }

    //Too much responsibility in here
    set swapCandidateCoord(coord: Phaser.Point){
        if(this._swapCandidateCoord == undefined && coord != this._currentlySelectedCoord && this.blockIsLegalSwapCandidate(coord)){
            this._swapCandidateCoord = coord;
            let payload: SwapVO = new SwapVO(this._currentlySelectedCoord, this._swapCandidateCoord);
            this.addBlockSwapEventListeners();
            this.dispatchEvent(GridEvents.ShowBlockUnselectedEvent, this._currentlySelectedCoord);
            this.dispatchEvent(GridEvents.ShowBlockSwapAnimationEvent, payload);
        }else{
            console.log("GridModel.set swapCandidateCoord::: Something went wrong. Why are we trying to set the swapCandidateCoord when there's already one?");
        }
    }

    blockIsLegalSwapCandidate(swapCandidateCoord: Phaser.Point): boolean{
        if(swapCandidateCoord.x == this._currentlySelectedCoord.x){
            if(swapCandidateCoord.y == this._currentlySelectedCoord.y+1 || swapCandidateCoord.y == this._currentlySelectedCoord.y-1){
                return true;
            }
        }
        if(swapCandidateCoord.y == this._currentlySelectedCoord.y){
            if(swapCandidateCoord.x == this._currentlySelectedCoord.x+1 || swapCandidateCoord.x == this._currentlySelectedCoord.x-1){
                return true;
            }
        }
        return false;
    }

    private addBlockSwapEventListeners(): void {
        this.addEventListener(GridEvents.SelectedBlockSwapAnimationCompleteEvent, this.onSelectedBlockSwapComplete.bind(this));
        this.addEventListener(GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this.onSwapCandidateBlockSwapComplete.bind(this));
    }
    
    private removeBlockSwapEventListeners(): void {
        this.removeEventListener(GridEvents.SelectedBlockSwapAnimationCompleteEvent);
        this.removeEventListener(GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent);
    }
    
    private onSelectedBlockSwapComplete(message?:any): void {
        this._selectedBlockSwapAnimationComplete = true;
        if(this._swapCandidateBlockSwapAnimationComplete && this._selectedBlockSwapAnimationComplete){
            this.handleBothBlockSwapAnimationsComplete(message);
        }
    }

    private onSwapCandidateBlockSwapComplete(message?:any): void {
        this._swapCandidateBlockSwapAnimationComplete = true;
        if(this._selectedBlockSwapAnimationComplete && this._swapCandidateBlockSwapAnimationComplete){
            this.handleBothBlockSwapAnimationsComplete(message);
        }
    }

    private handleBothBlockSwapAnimationsComplete(nodeMesh: NodeMesh): void{
        this.resetAnimationFlags();
        this.removeBlockSwapEventListeners();
        this._gridEvaluationInProgress = true;
        this.dispatchEvent(GridEvents.BlockSwapAnimationCompleteEvent);
        this.dispatchEvent(GridEvents.EvaluateGridEvent, nodeMesh);
    }

    get currentlySelectedCoord(): Phaser.Point{
        return this._currentlySelectedCoord;
    }

    get swapCandidateCoord(): Phaser.Point{
        return this._swapCandidateCoord;
    }

    private resetAnimationFlags(): void{
        this._selectedBlockSwapAnimationComplete = false;
        this._swapCandidateBlockSwapAnimationComplete = false;
    }

    resetSelectedAndSwapCoords(): void{
        this._swapCandidateCoord = undefined;
        this._currentlySelectedCoord = undefined;
    }
}