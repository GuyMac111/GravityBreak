import { BlockFactory } from "../Block/BlockFactory";
import { ISystemModel } from "./ISystemModel";
import { EventHub } from "./Events/EventHub";

export class SystemModel implements ISystemModel{
    private _blockFactory: BlockFactory;
    private _eventHub: EventHub;

    set blockFactory(blockFactory: BlockFactory){
        this._blockFactory = blockFactory;
    }

    get blockFactory(): BlockFactory{
        return this._blockFactory;
    }

    set eventHub(eventHub: EventHub) {
        this._eventHub = eventHub;
    }

    get eventHub(): EventHub{
        return this._eventHub;
    }
}