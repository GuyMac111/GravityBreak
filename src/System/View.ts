export class View{
    protected game: Phaser.Game;
    protected layerGroup: Phaser.Group;

    //Important to note: I'm calling these contructor args 'injected' just to highlight that I'd 
    //use/create dependency injection here given more time.

    constructor(injectedGame: Phaser.Game, layerGroup: Phaser.Group){
        this.game = injectedGame;
        this.layerGroup = layerGroup;
    }
}