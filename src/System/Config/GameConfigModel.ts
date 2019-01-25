import { GravityState } from "../../Gravity/GravityState";
import { BlockDestroyAnimation } from "../../Block/BlockDestroyAnimation";

export interface IGameConfigModel {
    gridPosition: Phaser.Point;
    gridSize: Phaser.Point;
    maskGridBounds: boolean;
    blockPadding: number;
    blockSize: number;
    blockSelectionDuration: number;
    blockFallDuration: number;
    blockInitialSpawnFallDuration: number;
    blockRepawnFallDuration: number;
    blockSwapDuration: number;
    cascadeDirection: GravityState;
    blockDestroyAnimation: BlockDestroyAnimation;
    time: number;
    targetScore: number;
}

export class GameConfigModel {

    private _gridPosition: Phaser.Point;
    private _gridSize: Phaser.Point;
    private _maskGridBounds: boolean;

    private _blockPadding: number;
    private _blockSize: number;
    private _blockSelectionDuration: number;

    private _blockFallDuration: number;
    private _blockInitialSpawnFallDuration: number;
    private _blockRepawnFallDuration: number;
    private _blockSwapDuration: number;
    
    private _cascadeDirection: GravityState;
    private _blockDestroyAnimation: BlockDestroyAnimation;
    
    private _time: number;
    private _targetScore: number;


    /**
     * Getter blockInitialSpawnFallDuration
     * @return {number}
     */
	public get blockInitialSpawnFallDuration(): number {
		return this._blockInitialSpawnFallDuration;
	}

    /**
     * Setter blockInitialSpawnFallDuration
     * @param {number} value
     */
	public set blockInitialSpawnFallDuration(value: number) {
		this._blockInitialSpawnFallDuration = value;
	}

    /**
     * Getter blockRepawnFallDuration
     * @return {number}
     */
	public get blockRepawnFallDuration(): number {
		return this._blockRepawnFallDuration;
	}

    /**
     * Setter blockRepawnFallDuration
     * @param {number} value
     */
	public set blockRepawnFallDuration(value: number) {
		this._blockRepawnFallDuration = value;
	}

    /**
     * Getter blockSwapDuration
     * @return {number}
     */
	public get blockSwapDuration(): number {
		return this._blockSwapDuration;
	}

    /**
     * Setter blockSwapDuration
     * @param {number} value
     */
	public set blockSwapDuration(value: number) {
		this._blockSwapDuration = value;
	}


    /**
     * Getter blockFallDuration
     * @return {number}
     */
	public get blockFallDuration(): number {
		return this._blockFallDuration;
	}

    /**
     * Setter blockFallDuration
     * @param {number} value
     */
	public set blockFallDuration(value: number) {
		this._blockFallDuration = value;
	}
    
    /**
     * Getter blockSelectionSpeed
     * @return {number}
     */
	public get blockSelectionDuration(): number {
		return this._blockSelectionDuration;
	}

    /**
     * Setter blockSelectionSpeed
     * @param {number} value
     */
	public set blockSelectionDuration(value: number) {
		this._blockSelectionDuration = value;
	}
    
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
     * @return {number}
     */
	public get blockPadding(): number {
		return this._blockPadding;
	}

    /**
     * Setter blockPadding
     * @param {number} value
     */
	public set blockPadding(value: number) {
		this._blockPadding = value;
    }
    
    /**
     * Getter blockSize
     * @return {number}
     */
	public get blockSize(): number {
		return this._blockSize;
	}

    /**
     * Setter blockSize
     * @param {Phaser.Point} value
     */
	public set blockSize(value: number) {
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