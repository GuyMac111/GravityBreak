import { BlockFactory } from "../Block/BlockFactory";
import { ISystemModel } from "./ISystemModel";

export class SystemModel implements ISystemModel{
    private _blockFactory: BlockFactory;

    set blockFactory(blockFactory: BlockFactory){
        this._blockFactory = blockFactory;
    }

    
    get blockFactory(): BlockFactory{
        return this._blockFactory;
    }
}