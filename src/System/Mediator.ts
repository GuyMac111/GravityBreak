import { View } from "./View"
export class Mediator{
    protected view: View;
    
    //Important to note: I'm calling these contructor args 'injected' just to highlight that I'd 
    //use/create dependency injection here given more time.
    constructor(injectedView: View){
        this.view = injectedView;
    }
}