define("GravityBreak", ["require", "exports", "typescript-collections"], function (require, exports, typescript_collections_1) {
    "use strict";
    class GravityBreakGame {
        constructor() {
            // create our phaser game
            // 800 - width
            // 600 - height
            // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
            // 'content' - the name of the container to add our game to
            // { preload:this.preload, create:this.create} - functions to call for our states
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        }
        preload() {
            // add our logo image to the assets class under the
            // key 'logo'. We're also setting the background colour
            // so it's the same as the background colour in the image
            this.game.load.spritesheet("diamonds", "assets/diamonds32x5.png", 64, 64, 5);
            this.game.stage.backgroundColor = 0xB20059;
        }
        create() {
            // add the 'logo' sprite to the game, position it in the
            // center of the screen, and set the anchor to the center of
            // the image so it's centered properly. There's a lot of
            // centering in that last sentence
            let diamond = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'diamonds', 1);
            diamond.anchor.setTo(0.5, 0.5);
            let dict = new typescript_collections_1.Dictionary();
            for (let i = 0; i < 10; i++) {
                let gridModel = new GridModel(i);
                dict.setValue(i, gridModel);
            }
            for (let i = 0; i < 10; i++) {
                if (dict.containsKey(i)) {
                    console.log("GUY::: Found dict element " + i);
                }
            }
        }
    }
    // when the page has finished loading, create our game
    function Initialise() {
        var game = new GravityBreakGame();
    }
    return GravityBreakGame;
});
// var game = new GravityBreakGame()
// window.onload = () => {
// 	var game = new GravityBreakGame();
// }
class GridModel {
    constructor(index) {
        this._index = index;
        console.log("GridModel: Class is being instatiated from a seperate .ts file. Index is " + this._index);
    }
    getIndex() {
        return 0;
    }
}
//# sourceMappingURL=gravityBreak.js.map