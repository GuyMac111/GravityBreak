import { Dictionary } from "typescript-collections";
import { EventHandler } from "./EventHandler";

export class EventHub{
    private _eventMap: Dictionary<string, ListenersList>;

    constructor(){
        this._eventMap = new Dictionary<string, ListenersList>();
    }

    //First REALLY naughty thing we've done. We just have to be careful with the messages we send with our events.
    addEventListener(eventType:string, handler:EventHandler, handleFunction: (message?:any) => void): void{
        if(!this._eventMap.containsKey(eventType)){
            this._eventMap.setValue(eventType, new ListenersList());
        }
        let listenersForEvent: ListenersList = this._eventMap.getValue(eventType);
        listenersForEvent.addListener(handler, handleFunction);
    }

    removeEventListener(eventType:string, handler:EventHandler): void{
        if(!this._eventMap.containsKey(eventType)){
            return;
        } else {
            this._eventMap.getValue(eventType).removeListener(handler);
        }
    }

    dispatchEvent(eventType: string, message?: any): void{
        if(!this._eventMap.containsKey(eventType)){
            return;
        }else{
            this._eventMap.getValue(eventType).dispatchAll(message);
        }
    }
}

class ListenersList{
    private _listenerCallbackMap: Dictionary<EventHandler, (message?:any) => void>;
    constructor(){
        this._listenerCallbackMap = new Dictionary<EventHandler, (message?:any) =>void>();
    }

    addListener(handler: EventHandler, handleFunction: (message?:any) => void): void{
        this._listenerCallbackMap.setValue(handler, handleFunction);
    }

    removeListener(handler: EventHandler): void{
        if(this._listenerCallbackMap.containsKey(handler)){
            this._listenerCallbackMap.remove(handler);
        }
    }

    dispatchAll(message?:any): void{
        this._listenerCallbackMap.forEach((handler: EventHandler, handleFunction: (message?:any) => void): void => {
            if(message!=undefined){
                handleFunction(message);    
            }else{
                handleFunction();
            }
        });
    }    
}