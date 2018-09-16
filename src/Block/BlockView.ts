import { View } from "../System/View";

export class BlockView extends View{
    private _diamondSprite: Phaser.Sprite;

    constructor(injectedGame: Phaser.Game, layerGroup: Phaser.Group){
        super(injectedGame, layerGroup);
    }

    initialise(startingCoordinates: Phaser.Point){
        this._diamondSprite = this.layerGroup.create(startingCoordinates.x,startingCoordinates.y,'diamonds',1);
        // this._diamondSprite.anchor.set(0.5,0.5);
    }

    moveToPosition(destinationCoordinates: Phaser.Point, onComplete?: () => void) {
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite).to({
                x: destinationCoordinates.x, 
                y: destinationCoordinates.y
            }, 200, Phaser.Easing.Linear.None);
        
        if(onComplete!=undefined){
            onComplete();
        }   
    }
}