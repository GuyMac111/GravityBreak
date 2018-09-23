import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { GridEvents } from "./GridEvents";
import { SwapVO } from "./VOs/SwapVO";
import { NodeMesh } from "./NodeMesh";
import { Input } from "phaser";
import { InputEvents } from "../Input/InputEvents";

export class GridModel extends EventHandler{
    //hmmmmmm.... Maybe 'InputModel' insted???
    private _currentlySelectedCoord: Phaser.Point;
    private _swapCandidateCoord: Phaser.Point;
    private _selectedBlockSwapAnimationComplete: boolean = false;
    private _swapCandidateBlockSwapAnimationComplete: boolean = false;

    constructor(injectedEventHub: EventHub){
        super(injectedEventHub);
        this.addEventListener(GridEvents.InitialiseGridCompleteEvent, this.onGridInitialisedEvent.bind(this));
    }

    get hasCurrentlySelectedBlock():  boolean{
        return this._currentlySelectedCoord != undefined;
    }

    selectBlock(coord: Phaser.Point): void{
        if(this._currentlySelectedCoord==undefined){
            this._currentlySelectedCoord = coord;
            this.dispatchEvent(GridEvents.ShowBlockSelectedEvent, this._currentlySelectedCoord);
        }else if (coord == this._currentlySelectedCoord){
            this.deselectAll();
        }else{
            if(this.blockIsLegalSwapCandidate(coord)){
                this._swapCandidateCoord = coord;
                let payload: SwapVO = new SwapVO(this._currentlySelectedCoord, this._swapCandidateCoord);
                this.dispatchEvent(InputEvents.DisableInputsEvent);
                this.dispatchEvent(GridEvents.ShowBlockUnselectedEvent, this._currentlySelectedCoord);
                this.addBlockSwapEventListeners();
                this.dispatchEvent(GridEvents.ShowBlockSwapAnimationEvent, payload);
            }else{
                this.deselectAll();
            }
        }
    }

    private deselectAll():void{
        let resetSelectedCoord: Phaser.Point = this._currentlySelectedCoord;
        let resetSwapCoord: Phaser.Point = this._swapCandidateCoord;
        this.resetSelectedAndSwapCoords();
        if(resetSelectedCoord!=undefined){
            this.dispatchEvent(GridEvents.ShowBlockUnselectedEvent, resetSelectedCoord);
        }
        if(resetSwapCoord!=undefined){
            this.dispatchEvent(GridEvents.ShowBlockUnselectedEvent, resetSwapCoord);
        }
    }

    private blockIsLegalSwapCandidate(swapCandidateCoord: Phaser.Point): boolean{
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

    private onGridInitialisedEvent(): void{
        this.dispatchEvent(InputEvents.EnableInputsEvent);
    }

    private addBlockSwapEventListeners(): void {
        this.addEventListener(GridEvents.SelectedBlockSwapAnimationCompleteEvent, this.onSelectedBlockSwapComplete.bind(this));
        this.addEventListener(GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this.onSwapCandidateBlockSwapComplete.bind(this));
    }
    
    private removeBlockSwapEventListeners(): void {
        this.removeEventListener(GridEvents.SelectedBlockSwapAnimationCompleteEvent);
        this.removeEventListener(GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent);
    }
    
    private onSelectedBlockSwapComplete(): void {
        this._selectedBlockSwapAnimationComplete = true;
        if(this._swapCandidateBlockSwapAnimationComplete && this._selectedBlockSwapAnimationComplete){
            this.handleBothBlockSwapAnimationsComplete();
        }
    }

    private onSwapCandidateBlockSwapComplete(): void {
        this._swapCandidateBlockSwapAnimationComplete = true;
        if(this._selectedBlockSwapAnimationComplete && this._swapCandidateBlockSwapAnimationComplete){
            this.handleBothBlockSwapAnimationsComplete();
        }
    }

    private handleBothBlockSwapAnimationsComplete(): void{
        this.resetAnimationFlags();
        this.removeBlockSwapEventListeners();
        this.dispatchEvent(GridEvents.BlockSwapAnimationCompleteEvent);
        this.addGridEvaluationEventListeners();
        this.dispatchEvent(GridEvents.EvaluateGridEvent);
    }

    get currentlySelectedCoord(): Phaser.Point{
        return this._currentlySelectedCoord;
    }

    get swapCandidateCoord(): Phaser.Point{
        return this._swapCandidateCoord;
    }
    
    resetSelectedAndSwapCoords(): void{
        this._swapCandidateCoord = undefined;
        this._currentlySelectedCoord = undefined;
    }
    
    private resetAnimationFlags(): void{
        this._selectedBlockSwapAnimationComplete = false;
        this._swapCandidateBlockSwapAnimationComplete = false;
    }

    private onGridEvaluationSuccessEvent(message?:any): void {
        this.resetSelectedAndSwapCoords();
        this.removeGridEvaluationEventListeners();
        this.addEventListener(GridEvents.BreakAndCascadeBlocksCompleteEvent, this.onBreakAndCascaseBlocksCompleteEvent.bind(this));
        this.dispatchEvent(GridEvents.BreakAndCascadeBlocksEvent, message);
    }
    
    private onBreakAndCascaseBlocksCompleteEvent(message?:any): void {
        console.log("GridModel.onBreakAndCascaseBlocksCompleteEvent()")
        this.addGridEvaluationEventListeners();
        this.dispatchEvent(GridEvents.EvaluateGridEvent);
    }

    private onGridEvaluationNegativeEvent(message?:any): void {
        this.removeGridEvaluationEventListeners();
        let negativeEvaluationWasResultOfASwap: boolean = this._currentlySelectedCoord!=undefined&&this._swapCandidateCoord!=undefined;
        let selectedCoord: Phaser.Point = this._currentlySelectedCoord;
        let swapCandidateCoord: Phaser.Point = this._swapCandidateCoord;
        this.resetSelectedAndSwapCoords;
        if(negativeEvaluationWasResultOfASwap){
            //bogus way of checking that this evaluation is a result of a swap.
            this.dispatchEvent(GridEvents.ShowBlockSwapAnimationEvent, new SwapVO(selectedCoord, swapCandidateCoord));
            this.deselectAll();
            this.dispatchEvent(InputEvents.EnableInputsEvent);
        }else{
            this.resetSelectedAndSwapCoords;
            this.addEventListener(GridEvents.RefillGridCompleteEvent,this.onRefillGridCompleteEvent.bind(this));
            this.dispatchEvent(GridEvents.RefillGridEvent);
        }
    }

    private onRefillGridCompleteEvent(): void{
        this.removeEventListener(GridEvents.RefillGridCompleteEvent);
        this.addRefillEvaluationEventListeners();
        this.dispatchEvent(GridEvents.EvaluateGridEvent);
    }
    
    private addRefillEvaluationEventListeners(): void{
        this.addEventListener(GridEvents.GridEvaluationPositiveEvent, this.onGridEvaluationSuccessEvent.bind(this));
        this.addEventListener(GridEvents.GridEvaluationNegativeEvent, this.onRefillEvaluationNegativeEvent.bind(this));
    }

    private onRefillEvaluationNegativeEvent(): void{
        this.dispatchEvent(InputEvents.EnableInputsEvent);
    }

    private addGridEvaluationEventListeners(): void{
        this.addEventListener(GridEvents.GridEvaluationPositiveEvent, this.onGridEvaluationSuccessEvent.bind(this));
        this.addEventListener(GridEvents.GridEvaluationNegativeEvent, this.onGridEvaluationNegativeEvent.bind(this));
    }

    private removeGridEvaluationEventListeners(): void{
        this.removeEventListener(GridEvents.GridEvaluationPositiveEvent);
        this.removeEventListener(GridEvents.GridEvaluationNegativeEvent);
    }
}