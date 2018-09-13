define("GravityBreak", ["require", "exports", "typescript-collections"], function (require, exports, Collections) {
    "use strict";
    var GravityBreakGame = /** @class */ (function () {
        function GravityBreakGame() {
            // create our phaser game
            // 800 - width
            // 600 - height
            // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
            // 'content' - the name of the container to add our game to
            // { preload:this.preload, create:this.create} - functions to call for our states
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        }
        GravityBreakGame.prototype.preload = function () {
            // add our logo image to the assets class under the
            // key 'logo'. We're also setting the background colour
            // so it's the same as the background colour in the image
            this.game.load.spritesheet("diamonds", "assets/diamonds32x5.png", 64, 64, 5);
            this.game.stage.backgroundColor = 0xB20059;
        };
        GravityBreakGame.prototype.create = function () {
            // add the 'logo' sprite to the game, position it in the
            // center of the screen, and set the anchor to the center of
            // the image so it's centered properly. There's a lot of
            // centering in that last sentence
            var diamond = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'diamonds', 1);
            diamond.anchor.setTo(0.5, 0.5);
            var dict = new Collections.Dictionary();
            for (var i = 0; i < 10; i++) {
                var gridModel = new GridModel(i);
                dict.setValue(i, gridModel);
            }
            for (var i = 0; i < 10; i++) {
                if (dict.containsKey(i)) {
                    console.log("GUY::: Found dict element " + i);
                }
            }
        };
        return GravityBreakGame;
    }());
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
var GridModel = /** @class */ (function () {
    function GridModel(index) {
        this._index = index;
        console.log("GridModel: Class is being instatiated from a seperate .ts file. Index is " + this._index);
    }
    GridModel.prototype.getIndex = function () {
        return 0;
    };
    return GridModel;
}());
//# sourceMappingURL=gravityBreak.js.map