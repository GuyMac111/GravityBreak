import { Set } from "typescript-collections";

export class BreakVO{
    private _coords: Set<Phaser.Point>;
    constructor(coords: Set<Phaser.Point>){
        this._coords = coords;
    }

    get coords(): Set<Phaser.Point>{
        return this._coords;
    }
}