import { GridController } from "./Grid/GridController";
import { Startup } from "./System/Startup";

class GravityBreakGame{
	game:Phaser.Game;
	
	constructor(){
		this.game = new Phaser.Game( 800, 600, Phaser.AUTO, 'content', { preload:this.preload, create:this.create} );
	}
	
	preload(){
		this.game.load.spritesheet("diamonds", "assets/diamonds32x5.png",64,64,5);
		this.game.stage.backgroundColor = 0xB20059;
	}
	
	create(){
		// let diamond = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY,'diamonds',1);
		// diamond.anchor.setTo( 0.5, 0.5 );

		let startup: Startup = new Startup(this.game);
		startup.initialiseGame();
	}

	
}

export = GravityBreakGame;



