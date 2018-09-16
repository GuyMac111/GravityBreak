import { View } from "../System/View";

export class BlockView extends View{
    private _diamondSprite: Phaser.Sprite;

    constructor(injectedGame: Phaser.Game, layerGroup: Phaser.Group){
        super(injectedGame, layerGroup);
    }

    initialise(startingCoordinates: Phaser.Point){
        this._diamondSprite = this.layerGroup.create(startingCoordinates.x,startingCoordinates.y,'diamonds',1);
    }

    moveToPosition(destinationCoordinates: Phaser.Point, onComplete?: () => void) {
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite).to({
                x: destinationCoordinates.x, 
                y: destinationCoordinates.y
            }, 100, Phaser.Easing.Linear.None);
        
        if(onComplete!=undefined){
            tween.onComplete.add(onComplete);
        }
        tween.start();
    }
}