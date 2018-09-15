import { BlockFactory } from "../Block/BlockFactory";
import { ISystemModel } from "./ISystemModel";

export class SystemModel implements ISystemModel{
    private _blockFactory: BlockFactory;

    setBlockFactory(blockFactory: BlockFactory): void{
        this._blockFactory = blockFactory;
    }

    getBlockFactory(): BlockFactory{
        return this._blockFactory;
    }
}