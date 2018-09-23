import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { ScoreEvents } from "./ScoreEvents";
import { BreakVO } from "../Grid/VOs/BreakVO";

export class ScoreModel extends EventHandler{
    private readonly SCORE_PER_BLOCK: number = 100;

    private _currentScore: number;

    scoreUpdated:(newScore:number, amountAdded: number) => void;

    constructor(injectedEventHub: EventHub){
        super(injectedEventHub);
        this._currentScore = 0;
        this.addEventListener(ScoreEvents.UpdateScoreForBlocksBrokenEvent, this.onUpdateScoreEvent.bind(this));
    }

    private onUpdateScoreEvent(breakVOs: BreakVO[]): void{
        let totalBlocksBroken: number = 0; 
        for(let i = 0;i<breakVOs.length;i++){
            totalBlocksBroken += breakVOs[i].coords.size();
        }
        let additionalScore = totalBlocksBroken*this.SCORE_PER_BLOCK;
        this._currentScore += additionalScore;
        if(this.scoreUpdated!=undefined){
            this.scoreUpdated(this._currentScore, additionalScore);
        }
    }
    
}