export class GridModel{
    //hmmmmmm.... Maybe 'InputModel' insted???
    private _currentlySelectedCoord: Phaser.Point;
    private _swapCandidateCoord: Phaser.Point;

    constructor(){
        
    }

    get hasCurrentlySelectedBlock():  boolean{
        return this._currentlySelectedCoord != undefined;
    }

    set currentlySelectedCoord(coord: Phaser.Point){
        if(this._currentlySelectedCoord==undefined){
            this._currentlySelectedCoord = coord;
        }else{
            console.log("GridModel.set currentlySelectedCoord::: Something went wrong. Why are we trying to set the currSelectedCoord when there's already one?");
        }
    }

    set swapCandidateCoord(coord: Phaser.Point){
        if(this._swapCandidateCoord==undefined){
            this._swapCandidateCoord = coord;
        }else{
            console.log("GridModel.set swapCandidateCoord::: Something went wrong. Why are we trying to set the swapCandidateCoord when there's already one?");
        }
    }

    get currentlySelectedCoord(): Phaser.Point{
        return this._currentlySelectedCoord;
    }

    get swapCandidateCoord(): Phaser.Point{
        return this._swapCandidateCoord;
    }

    resetSelectedAndSwapCoords(): void{
        this._swapCandidateCoord = undefined;
        this._currentlySelectedCoord = undefined;
    }
}