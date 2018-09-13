class GridModel{
private _index: number;

    constructor(index: number){
        this._index  = index;
        console.log("GridModel: Class is being instatiated from a seperate .ts file. Index is "+this._index);
    }

    getIndex(): number{
        return 0;
    }

}