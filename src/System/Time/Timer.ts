import { EventHub } from "../Events/EventHub";
import { EventHandler } from "../Events/EventHandler";
import { TimerEvent } from "phaser";
import { TimerEvents } from "./TimerEvents";

export class Timer extends EventHandler{
    public static readonly ROUND_TIME: number = 100;
    
    private _timeRemaining: number;
    private _timerEvent: TimerEvent;
    private _game: Phaser.Game;

    constructor(injectedGame:Phaser.Game, injectedEventHub: EventHub){
        super(injectedEventHub);
        this._game = injectedGame;
        this._timeRemaining = Timer.ROUND_TIME;
        this.addEventListener(TimerEvents.StartTimeEvent, this.onStartTimerEvent.bind(this));
    }
    
    private onStartTimerEvent(): void{
        this._timerEvent = this._game.time.events.loop(Phaser.Timer.SECOND, this.onInterval.bind(this), this);
    }

    private onTimeExpired(): void{
        this._game.time.events.remove(this._timerEvent);
        this.dispatchEvent(TimerEvents.TimeExpiredEvent);
    }

    private onInterval(): void {
        this._timeRemaining--;
        if(this._timeRemaining<0){
            this.onTimeExpired();
        }else{
            this.dispatchEvent(TimerEvents.TimeIntervalElapsedEvent, this._timeRemaining);
        }
    }
}