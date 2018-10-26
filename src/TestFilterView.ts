import { Assets } from "./System/Assets";

export class TestFilterView {
    private _diamondSprite: Phaser.Sprite;
    
    constructor(game: Phaser.Game){
        this._diamondSprite = game.add.sprite(game.width/2, game.height/2, Assets.SpriteDiamonds,0);
        this._diamondSprite.filters = [new MyShader(game, null, null)];
        this._diamondSprite.anchor = new Phaser.Point(0.5,0.5);
    }
}

class Uniforms{
    gray: any;
}

export class MyShader extends Phaser.Filter {
    uniforms: Uniforms;

    constructor(game: Phaser.Game, uniforms: any, fragmentSrc: string[]){
        let mUniforms = new Uniforms();
        mUniforms.gray = {type:'1f', value:1.0};
        let mfragmentSrc = [
            "precision mediump float;",

            "varying vec2       vTextureCoord;",
            "varying vec4       vColor;",
            "uniform sampler2D  uSampler;",
            "uniform float      gray;",

            "void main(void) {",
                "gl_FragColor = texture2D(uSampler, vTextureCoord);",
                "gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r",
                                            "+ 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);",
                
            "}"
        ];
        
        super(game, mUniforms, mfragmentSrc);
    }
}