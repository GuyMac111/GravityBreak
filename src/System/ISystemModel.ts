import { BlockFactory } from "../Block/BlockFactory";

export interface ISystemModel{
    getBlockFactory(): BlockFactory;
}