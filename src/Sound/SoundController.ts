import { EventHandler } from "../System/Events/EventHandler";
import { EventHub } from "../System/Events/EventHub";
import { Sound } from "phaser";
import { SoundEvents } from "./SoundEvents";
import { Assets } from "../System/Assets";

export class SoundController extends EventHandler{
    //A crude sound handler. We could use pooling here. 
    //And also I'm readin about the very familiar issue of .mp3 format decoding 
    //causing delays. But that's for another day.
    private _game: Phaser.Game;

    private _explosion: Sound;
    private _bgm: Sound;
    private _cascade: Sound;
    
    constructor(injectedGame: Phaser.Game, injectedEventHub: EventHub){
        super(injectedEventHub);
        this._game = injectedGame;    
        this.addEventListener(SoundEvents.PlayBGMEvent ,this.onPlayBGMEvent.bind(this));
        this.addEventListener(SoundEvents.PlayExplosionEvent ,this.onPlayExplosionSFXEvent.bind(this));
        this.addEventListener(SoundEvents.PlayCascadeEvent ,this.onPlayCascadeSFXEvent.bind(this));
    }

    initialise(): void{
        this._explosion = this._game.add.audio(Assets.SFXBreak);
        this._bgm = this._game.add.audio(Assets.SFXBgm,1,true); 
        this._cascade = this._game.add.audio(Assets.SFXCascade,0.7); 
    }

    ////
    //Obviously in a more complex game we would map these into a dictionary with keys, and pass that key as a payload through a single event
    ////
    private onPlayBGMEvent(): void{
        this._bgm.play();
    }

    private onPlayExplosionSFXEvent(): void{
        this._explosion.play();
    }

    private onPlayCascadeSFXEvent(): void{
        this._cascade.play();
    }

}