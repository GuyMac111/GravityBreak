import { EventHandler } from "./Events/EventHandler";
import { EventHub } from "./Events/EventHub";
export class Mediator extends EventHandler{
    
    //Important to note: I'm calling these contructor args 'injected' just to highlight that I'd 
    //use/create dependency injection here given more time.
    constructor(injectedEventHub:EventHub){
        super(injectedEventHub);
    }
}