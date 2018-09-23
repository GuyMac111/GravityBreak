import { View } from "../System/View";
import { GravityState } from "../Gravity/GravityState";
import { Dictionary } from "typescript-collections";
import { Assets } from "../System/Assets";

export class PlanetView extends View{
    //We're going to hardcode these here for time's sake. They could be moved to a model based on the grid/game dimensions at some point.
    //also we won't take the "gridoffset" the blocks have into account.
    private readonly PLANET_TOP_POS: Phaser.Point = new Phaser.Point(288,-100);
    private readonly PLANET_BOTTOM_POS: Phaser.Point = new Phaser.Point(288,600+100);
    private readonly PLANET_LEFT_POS: Phaser.Point = new Phaser.Point(-100,288);
    private readonly PLANET_RIGHT_POS: Phaser.Point = new Phaser.Point(576+100,288);
    private readonly PLANET_MOVE_DURATION: number = 1500;
    
    private _planetSprite: Phaser.Sprite;
    private _gravityStatePlanetLocationMap: Dictionary<GravityState, Phaser.Point>;

    constructor(injectedGame:Phaser.Game, layerGroup: Phaser.Group){
        super(injectedGame, layerGroup);
    }

    initialise(): void{
        this._gravityStatePlanetLocationMap = new Dictionary<GravityState, Phaser.Point>();
        this._gravityStatePlanetLocationMap.setValue(GravityState.Up, this.PLANET_TOP_POS);
        this._gravityStatePlanetLocationMap.setValue(GravityState.Down, this.PLANET_BOTTOM_POS);
        this._gravityStatePlanetLocationMap.setValue(GravityState.Left, this.PLANET_LEFT_POS);
        this._gravityStatePlanetLocationMap.setValue(GravityState.Right, this.PLANET_RIGHT_POS);

        let startingPosition = this.PLANET_BOTTOM_POS;
        this._planetSprite = this.layerGroup.create(startingPosition.x,startingPosition.y,Assets.SpritePlanet);
        this._planetSprite.scale = new Phaser.Point(1.5, 1.5);
        this._planetSprite.anchor = new Phaser.Point(0.5, 0.5);
    }


    //We could make this movement much, much smoother and more circular with clever use of easing functions. But that's for another time.
    movePlanet(gravityState: GravityState, onComplete: ()=>void): void{
        let destination: Phaser.Point = this._gravityStatePlanetLocationMap.getValue(gravityState);
        
        let tweenX: Phaser.Tween =this.game.add.tween(this._planetSprite).to({
            x: destination.x,
            y: destination.y
        },this.PLANET_MOVE_DURATION, Phaser.Easing.Linear.None, false);
        
        // let tweenY: Phaser.Tween =this.game.add.tween(this._planetSprite).to({
        //     y: destination.y
        // },this.PLANET_MOVE_DURATION, Phaser.Easing.Quintic.In, false);

        tweenX.onComplete.add(onComplete);
        tweenX.start();
        // tweenY.start();
    }
    
}