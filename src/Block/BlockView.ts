import { View } from "../System/View";

export class BlockView extends View{
    constructor(injectedGame: Phaser.Game, layerGroup: Phaser.Group){
        super(injectedGame, layerGroup);
    }
}