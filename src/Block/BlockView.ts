import { View } from "../System/View";
import { BlockColour } from "./BlockColour";
import { Easing } from "phaser";

export class BlockView extends View{
    private readonly SELECTION_SPEED: number = 200;
    private readonly GRID_OFFSET: number = 32;//We know the blocks are square and we want them at their center.

    private _diamondSprite: Phaser.Sprite;

    onTouch: ()=>void;

    constructor(injectedGame: Phaser.Game, layerGroup: Phaser.Group){
        super(injectedGame, layerGroup);
    }

    initialise(startingGridCoordinates: Phaser.Point, colour: BlockColour){
        let startingCoords: Phaser.Point = this.translateGridCoordsToWorld(startingGridCoordinates);
        this._diamondSprite = this.layerGroup.create(startingCoords.x,startingCoords.y,'diamonds',colour);
        this._diamondSprite.anchor = new Phaser.Point(0.5,0.5);
        this._diamondSprite.inputEnabled = true;
        this._diamondSprite.events.onInputDown.add(this.onBlockTouched, this);
    }

    moveToPosition(destinationGridCoordinates: Phaser.Point, speed:number, onComplete?: () => void) {
        let dest: Phaser.Point = this.translateGridCoordsToWorld(destinationGridCoordinates);
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite).to({
                x: dest.x, 
                y: dest.y
            }, speed, Phaser.Easing.Linear.None);
        
        if(onComplete!=undefined){
            tween.onComplete.add(onComplete);
        }
        tween.start();
    }

    cascadeToPosition(destinationGridCoordinates: Phaser.Point, speed:number, onComplete?: () => void) {
        let dest: Phaser.Point = this.translateGridCoordsToWorld(destinationGridCoordinates);
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite).to({
                x: dest.x, 
                y: dest.y
            }, speed, Phaser.Easing.Cubic.In);
        
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
        tween.start();
    }

    showBlockDestroyAnimation(delay:number, onComplete?:() => void){
        let horizTween:Phaser.Tween = this.game.add.tween(this._diamondSprite.scale).to({x:1.25,y:0.05},300, Phaser.Easing.Elastic.Out,false,delay);
        let vertTween:Phaser.Tween = this.game.add.tween(this._diamondSprite.scale).to({x:0,y:0},200, Phaser.Easing.Linear.None,false, 50);
        vertTween.onComplete.add(onComplete);
        horizTween.chain(vertTween);
        horizTween.start();
    }

    destroySpriteInstance():void{
        this._diamondSprite.destroy();
    }

    private onBlockTouched(): void{
        if(this.onTouch!=undefined){
            this.onTouch();
        }
    }

    private translateGridCoordsToWorld(gridCoords: Phaser.Point): Phaser.Point{
        return new Phaser.Point(gridCoords.x*64+this.GRID_OFFSET, gridCoords.y*64+this.GRID_OFFSET);
    }
}