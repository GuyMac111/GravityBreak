import { EventHub } from "./EventHub";

export class EventHandler{
    private _eventHub: EventHub;

    constructor(injectedEventHub: EventHub){
        this._eventHub = injectedEventHub;
    }

    protected addEventListener(eventType: string, onEvent:(message?:any) => void ){
        this._eventHub.addEventListener(eventType, this, onEvent);
    }

    protected removeEventListener(eventType: string): void{
        this._eventHub.removeEventListener(eventType, this);
    }


    //hmmmm....COULD move this into a child class explicitly designated 'Dispatcher' in order to truly distinguish between the two for clarity.
    protected dispatchEvent(eventType: string, message?:any):void{
        this._eventHub.dispatchEvent(eventType, message);
    }
}