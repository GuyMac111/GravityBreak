import { BlockFactory } from "../Block/BlockFactory";
import { EventHub } from "./Events/EventHub";

export interface ISystemModel{
    blockFactory: BlockFactory;
    eventHub: EventHub;
}