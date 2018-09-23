import { View } from "../System/View";
import { Graphics, Rectangle, Text, Tween } from "phaser";
import { Timer } from "../System/Time/Timer";

export class ControlPanelView extends View{
    private readonly ROTATE_LEFT_DIMS: Rectangle = new Phaser.Rectangle(600,340,180,100);
    private readonly ROTATE_RIGHT_DIMS: Rectangle = new Phaser.Rectangle(600,460,180,100);
    private readonly BACKGROUND_PANEL_DIMS: Rectangle = new Phaser.Rectangle(580,0,220,600);
    private readonly SCORE_POS: Phaser.Point = new Phaser.Point(620, 220);
    private readonly TIME_POS: Phaser.Point = new Phaser.Point(640, 80);
    private readonly SCORE_TWEEN_DURATION: number = 500;
    
    private _backgroundPanel: Graphics;
    private _rotateLeftButton: Graphics;
    private _rotateRightButton: Graphics;
    private _scoreText: Text;
    private _score: number;
    private _timeRemainingtext: Text;
    private _textStyle = { font: "37px Arial", fill: "#000000", align: "center" };

    rotateLeftTouched: ()=> void;
    rotateRightTouched: ()=> void;

    constructor(injectedGame:Phaser.Game, injectedLayerGroup: Phaser.Group){
        super(injectedGame, injectedLayerGroup);
    }

    initialise(): void{
        this.initialiseButtons();
        this._score = 0;
        this.initialiseScore();
        this.initiliseTimer();
    }

    //These are only public so that the tween may tick them
    set score(value: number){
        this._score = Math.floor(value);
        this._scoreText.text = `SCORE\n${this._score}`;
    }

    get score(): number {
        //we need a getter otherwise the tween won't work. It'll start from zero every time, as i presume the tween class cant access the prop.
        return this._score;
    }

    initiliseTimer(): void{
        this._timeRemainingtext = this.game.add.text(this.TIME_POS.x,this.TIME_POS.y,`TIME\n${Timer.ROUND_TIME}`, this._textStyle, this.layerGroup);
    }

    initialiseScore(): void{
        this._scoreText = this.game.add.text(this.SCORE_POS.x,this.SCORE_POS.y, `SCORE\n${this._score}`, this._textStyle, this.layerGroup);
    }

    initialiseButtons(): void{
        this._backgroundPanel = this.game.add.graphics(this.BACKGROUND_PANEL_DIMS.x,this.BACKGROUND_PANEL_DIMS.y, this.layerGroup);
        this._backgroundPanel.beginFill(0x767676);
        this._backgroundPanel.drawRect(0,0,this.BACKGROUND_PANEL_DIMS.width,this.BACKGROUND_PANEL_DIMS.height);
        this._backgroundPanel.endFill();

        this._rotateLeftButton = this.game.add.graphics(this.ROTATE_LEFT_DIMS.x, this.ROTATE_LEFT_DIMS.y, this.layerGroup);
        this._rotateRightButton = this.game.add.graphics(this.ROTATE_RIGHT_DIMS.x, this.ROTATE_RIGHT_DIMS.y, this.layerGroup);
        this._rotateLeftButton.beginFill(0xFFFFFF);
        this._rotateRightButton.beginFill(0xFFFFFF);
        this._rotateLeftButton.drawRect(0,0,this.ROTATE_LEFT_DIMS.width,this.ROTATE_LEFT_DIMS.height);
        this._rotateRightButton.drawRect(0,0,this.ROTATE_RIGHT_DIMS.width,this.ROTATE_RIGHT_DIMS.height);
        this._rotateLeftButton.endFill();
        this._rotateRightButton.endFill();

        this._rotateLeftButton.inputEnabled = true;
        this._rotateRightButton.inputEnabled = true;
        this._rotateLeftButton.events.onInputDown.add(this.onRotateLeftTouched,this);
        this._rotateRightButton.events.onInputDown.add(this.onRotateRightTouched,this);

        let textStyle = { font: "65px Arial", fill: "#000000" };

        let leftArrow: Phaser.Text = this.game.add.text(this.ROTATE_LEFT_DIMS.centerX-20,this.ROTATE_LEFT_DIMS.centerY-30,"<",textStyle,this.layerGroup);
        let rightArrow: Phaser.Text = this.game.add.text(this.ROTATE_RIGHT_DIMS.centerX-20,this.ROTATE_RIGHT_DIMS.centerY-30,">",textStyle,this.layerGroup);
    }

    updateTimer(timeRemaining:number): void{
        this._timeRemainingtext.text = `TIME\n${timeRemaining}`;
    }

    updateScore(newScore: number, additionalAmount: number): void{
        let tween: Tween = this.game.add.tween(this).to({
            score: newScore
        },this.SCORE_TWEEN_DURATION, Phaser.Easing.Quadratic.In, false);
        tween.start();
    }

    private onRotateLeftTouched(): void{
        if(this.rotateLeftTouched!=undefined){
            this.rotateLeftTouched();
        }
    }

    private onRotateRightTouched(): void{
        if(this.rotateRightTouched!=undefined){
            this.rotateRightTouched();
        }
    }

}