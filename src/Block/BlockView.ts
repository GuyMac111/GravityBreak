import { View } from "../System/View";
import { BlockColour } from "./BlockColour";
import { Assets } from "../System/Assets";
import { IGameConfigModel } from "../System/Config/GameConfigModel";

export class BlockView extends View{    
    private _diamondSprite: Phaser.Sprite;
    private _gameConfig: IGameConfigModel;

    onTouch: ()=>void;
    playDestructionAudio: ()=>void;

    constructor(injectedGame: Phaser.Game, layerGroup: Phaser.Group, gameConfig: IGameConfigModel){
        super(injectedGame, layerGroup);
        this._gameConfig = gameConfig;
    }

    initialise(startingGridCoordinates: Phaser.Point, colour: BlockColour){
        let startingCoords: Phaser.Point = this.translateGridCoordsToWorld(startingGridCoordinates);
        this._diamondSprite = this.layerGroup.create(startingCoords.x,startingCoords.y,this._gameConfig.blockSprites[colour]);
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
        }, this._gameConfig.blockSelectionDuration, Phaser.Easing.Bounce.Out);
        tween.start();
    }

    showBlockUnselected():void{
        let tween:Phaser.Tween = this.game.add.tween(this._diamondSprite.scale).to({
            x: 1,
            y: 1
        }, this._gameConfig.blockSelectionDuration, Phaser.Easing.Bounce.Out)
        tween.start();
    }

    showBlockDestroyAnimation(delay:number, onStart:()=>void, onComplete?:() => void){
        let horizTween:Phaser.Tween = this.game.add.tween(this._diamondSprite.scale).to({x:1.25,y:0.05},300, Phaser.Easing.Elastic.Out,false,delay);
        let vertTween:Phaser.Tween = this.game.add.tween(this._diamondSprite.scale).to({x:0,y:0},200, Phaser.Easing.Linear.None,false, 50);
        vertTween.onComplete.add(onComplete);
        vertTween.onStart.add(onStart);
        horizTween.chain(vertTween);
        horizTween.start();
    }

    destroySpriteInstance():void{
        this._diamondSprite.destroy();
    }

    private get spriteCenterOffset(): number{
        return this._gameConfig.blockSize/2;
    }

    private onBlockTouched(): void{
        if(this.onTouch!=undefined){
            this.onTouch();
        }
    }

    private translateGridCoordsToWorld(gridCoords: Phaser.Point): Phaser.Point{
        return new Phaser.Point(
                gridCoords.x*(this._gameConfig.blockSize+this._gameConfig.blockPadding)+this.spriteCenterOffset+this._gameConfig.gridPosition.x, 
                gridCoords.y*(this._gameConfig.blockSize+this._gameConfig.blockPadding)+this.spriteCenterOffset+this._gameConfig.gridPosition.y
            );
    }
}