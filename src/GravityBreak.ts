import { Startup } from "./System/Startup";

class GravityBreakGame{
	game:Phaser.Game;
	
	constructor(){
		this.game = new Phaser.Game( 800, 600, Phaser.AUTO, 'content', { preload:this.preload, create:this.create} );
	}
	
	preload(){
		this.game.load.spritesheet("diamonds", "assets/diamonds32x5.png",64,64,5);
		this.game.load.image("planet","assets/rock-planet.png");
		this.game.stage.backgroundColor = 0x000000;
	}
	
	create(){
		let startup: Startup = new Startup(this.game);
		startup.initialiseGame();
	}
}

export = GravityBreakGame;



