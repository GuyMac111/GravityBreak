import { Startup } from "./System/Startup";
import { Assets } from "./System/Assets";

class GravityBreakGame{
	game:Phaser.Game;
	
	constructor(){
		this.game = new Phaser.Game( 800, 600, Phaser.AUTO, 'content', { preload:this.preload, create:this.create} );
	}
	
	preload(){
		this.game.load.spritesheet(Assets.SpriteDiamonds, "assets/diamonds32x5.png",64,64,5);
		this.game.load.image(Assets.SpritePlanet,"assets/rock-planet.png");
		this.game.load.audio(Assets.SFXBreak,"assets/break-sfx.wav");
		this.game.load.audio(Assets.SFXCascade, "assets/cascading-sfx.wav");
		this.game.load.audio(Assets.SFXBgm, "assets/totally-open-source-bgm.mp3");
		this.game.stage.backgroundColor = 0x000000;
	}
	
	create(){
		let startup: Startup = new Startup(this.game);
		startup.initialiseGame();
	}
}

export = GravityBreakGame;



