import { GravityState } from "../../Gravity/GravityState";
import { BlockDestroyAnimation } from "../../Block/BlockDestroyAnimation";

export interface IGameConfigModel {
    gridPosition: Phaser.Point;
    gridSize: Phaser.Point;
    maskGridBounds: boolean;
    blockPadding: Phaser.Point;
    blockSize: Phaser.Point;
    cascadeDirection: GravityState;
    blockDestroyAnimation: BlockDestroyAnimation;
    time: number;
    targetScore: number;
}

export class GameConfigModel {

    private _gridPosition: Phaser.Point;
    private _gridSize: Phaser.Point;
    private _maskGridBounds: boolean;

    private _blockPadding: Phaser.Point;
    private _blockSize: Phaser.Point;

    private _cascadeDirection: GravityState;
    private _blockDestroyAnimation: BlockDestroyAnimation;
    
    private _time: number;
    private _targetScore: number;

    /**
     * Getter gridPosition
     * @return {Phaser.Point}
     */
	public get gridPosition(): Phaser.Point {
		return this._gridPosition;
	}

    /**
     * Setter gridPosition
     * @param {Phaser.Point} value
     */
	public set gridPosition(value: Phaser.Point) {
		this._gridPosition = value;
     }    

    /**
     * Getter gridSize
     * @return {Phaser.Point}
     */
	public get gridSize(): Phaser.Point {
		return this._gridSize;
	}

    /**
     * Setter gridSize
     * @param {Phaser.Point} value
     */
	public set gridSize(value: Phaser.Point) {
		this._gridSize = value;
	}

    /**
     * Getter maskGridBounds
     * @return {boolean}
     */
	public get maskGridBounds(): boolean {
		return this._maskGridBounds;
	}

    /**
     * Setter maskGridBounds
     * @param {boolean} value
     */

    /**
     * Getter blockPadding
     * @return {Phaser.Point}
     */
	public get blockPadding(): Phaser.Point {
		return this._blockPadding;
	}

    /**
     * Setter blockPadding
     * @param {Phaser.Point} value
     */
	public set blockPadding(value: Phaser.Point) {
		this._blockPadding = value;
    }
    
    /**
     * Getter blockSize
     * @return {Phaser.Point}
     */
	public get blockSize(): Phaser.Point {
		return this._blockSize;
	}

    /**
     * Setter blockSize
     * @param {Phaser.Point} value
     */
	public set blockSize(value: Phaser.Point) {
		this._blockSize = value;
	}

	public set maskGridBounds(value: boolean) {
		this._maskGridBounds = value;
    }
    

    /**
     * Getter $cascadeDirection
     * @return {GravityState}
     */
	public get cascadeDirection(): GravityState {
		return this._cascadeDirection;
	}

    /**
     * Setter $cascadeDirection
     * @param {GravityState} value
     */
	public set cascadeDirection(value: GravityState) {
		this._cascadeDirection = value;
	}


    /**
     * Getter $blockDestroyAnimation
     * @return {BlockDestroyAnimation}
     */
	public get blockDestroyAnimation(): BlockDestroyAnimation {
		return this._blockDestroyAnimation;
	}

    /**
     * Setter $blockDestroyAnimation
     * @param {BlockDestroyAnimation} value
     */
	public set blockDestroyAnimation(value: BlockDestroyAnimation) {
		this._blockDestroyAnimation = value;
	}

    /**
     * Getter time
     * @return {number}
     */
	public get time(): number {
		return this._time;
	}

    /**
     * Setter time
     * @param {number} value
     */
	public set time(value: number) {
		this._time = value;
	}

    /**
     * Getter targetScore
     * @return {number}
     */
	public get targetScore(): number {
		return this._targetScore;
	}

    /**
     * Setter targetScore
     * @param {number} value
     */
	public set targetScore(value: number) {
		this._targetScore = value;
	}
}