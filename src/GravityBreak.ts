import { Startup } from "./System/Startup";
import { Assets } from "./System/Assets";
import { IGameConfigModel } from "./System/Config/GameConfigModel";
import { GameConfigParser } from "./System/Config/GameConfigParser";

class GravityBreakGame{
	game:Phaser.Game;
	
	private _configModel: IGameConfigModel;

	constructor(){
		this.game = new Phaser.Game( 800, 600, Phaser.AUTO, 'content', { preload:this.preload, create:this.create} );
	}
	
	preload(){
		let loadTheRestFunc = () => {
			console.log('config complete');
			this.game.load.onFileComplete.remove(loadTheRestFunc, this);
			this._configModel = new GameConfigParser().parse(this.game.cache.getJSON(Assets.Config));
			this.game.load.spritesheet(Assets.SpriteDiamonds, "assets/diamonds32x5.png",64,64,5);
			this.game.load.image(Assets.SpritePlanet,"assets/rock-planet.png");
			this.game.load.audio(Assets.SFXBreak,"assets/break-sfx.wav");
			this.game.load.audio(Assets.SFXCascade, "assets/cascading-sfx.wav");
			this.game.load.audio(Assets.SFXBgm, "assets/totally-open-source-bgm.mp3");
			this.game.stage.backgroundColor = 0x000000;
		}
		this.game.load.onFileComplete.add(loadTheRestFunc, this);
		this.game.load.onLoadComplete.add(()=>{
			console.log('load complete');
		}, this);
		this.game.load.json(Assets.Config, "assets/config.json");
	}
	
	create(){
		console.log('create start');
		let startup: Startup = new Startup(this.game, this._configModel);
		startup.initialiseGame();
	}
}

export = GravityBreakGame;



