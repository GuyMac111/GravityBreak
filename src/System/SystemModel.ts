import { BlockFactory } from "../Block/BlockFactory";
import { ISystemModel } from "./ISystemModel";

export class SystemModel implements ISystemModel{
    private _blockFactory: BlockFactory;

    setBlockFactory(blockFactory: BlockFactory): void{
        this._blockFactory = blockFactory;
    }

    //TODO:: Setup interface so that this becomes a getter. 
    //Having multiple patterns across such a small project is NOT a good look.
    getBlockFactory(): BlockFactory{
        return this._blockFactory;
    }
}