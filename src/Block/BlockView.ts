import { View } from "../System/View";
import { BlockColour } from "./BlockColour";

export class BlockView extends View{
    private readonly SELECTION_SPEED: number = 200;

    private _diamondSprite: Phaser.Sprite;

    onTouch: ()=>void;

    constructor(injectedGame: Phaser.Game, layerGroup: Phaser.Group){
        super(injectedGame, layerGroup);
    }

    initialise(startingCoordinates: Phaser.Point, colour: BlockColour){
        this._diamondSprite = this.layerGroup.create(startingCoordinates.x,startingCoordinates.y,'diamonds',colour);
        this._diamondSprite.inputEnabled = true;
        this._diamondSprite.events.onInputDown.add(this.onBlockTouched, this);
    }

    moveToPosition(destinationCoordinates: Phaser.Point, speed:number, onComplete?: () => void) {
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite).to({
                x: destinationCoordinates.x, 
                y: destinationCoordinates.y
            }, speed, Phaser.Easing.Linear.None);
        
        if(onComplete!=undefined){
            tween.onComplete.add(onComplete);
        }
        tween.start();
    }

    showBlockSelected():void{
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite.scale).to({
            x: 1.2,
            y: 1.2
        }, this.SELECTION_SPEED, Phaser.Easing.Bounce.Out);
        tween.start();
    }

    showBlockUnselected():void{
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite.scale).to({
            x: 1,
            y: 1
        }, this.SELECTION_SPEED, Phaser.Easing.Bounce.Out)
        tween.onComplete.add(function(){
            console.log("Block unselection complete");
        })
        tween.start();
        
    }

    private onBlockTouched(): void{
        if(this.onTouch!=undefined){
            this.onTouch();
        }
    }
}