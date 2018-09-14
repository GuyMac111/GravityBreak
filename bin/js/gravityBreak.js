define("Grid/GridNode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridNode {
        constructor(gridCoordinate) {
            this._gridCoordinate = new Phaser.Point(gridCoordinate.x, gridCoordinate.y);
        }
        get gridCoordinate() {
            return this._gridCoordinate;
        }
    }
    exports.GridNode = GridNode;
});
define("Grid/GridController", ["require", "exports", "typescript-collections", "Grid/GridNode"], function (require, exports, typescript_collections_1, GridNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridController {
        constructor(nodesHigh, nodesWide) {
            this._dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
            this._gridNodes = new typescript_collections_1.Dictionary();
            this.initialise();
            this.associateGridNodes();
        }
        initialise() {
            for (let i = 0; i < this._dimensionsInNodes.x; i++) {
                for (let j = 0; j < this._dimensionsInNodes.y; j++) {
                    let node = new GridNode_1.GridNode(new Phaser.Point(i, j));
                    this._gridNodes.setValue(node.gridCoordinate, node);
                    console.log(`GridController::: Created node with grid location ${node.gridCoordinate.x},${node.gridCoordinate.y}`);
                }
            }
        }
        associateGridNodes() {
            this._gridNodes.forEach(this.associateNode.bind(this));
            // this._gridNodes.forEach()
        }
        associateNode(gridCoordinate, nodeToAssociate) {
            console.log(`GridController::: Associating node at ${nodeToAssociate.gridCoordinate}`);
            this.associateAbove(nodeToAssociate);
            this.associateBelow(nodeToAssociate);
            this.associateLeft(nodeToAssociate);
            this.associateRight(nodeToAssociate);
        }
        associateAbove(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.y > 0) {
                //If it's not in the top row
                nodeToAssociate.nodeAbove = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y - 1));
                console.log(`GridController::: The node above node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
            }
            else {
                console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is at the top. So no above node associated`);
            }
        }
        associateBelow(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.y < this._dimensionsInNodes.y - 1) {
                //If it's not in the bottom row
                nodeToAssociate.nodeBelow = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y + 1));
                console.log(`GridController::: The node below node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeBelow.gridCoordinate}`);
            }
            else {
                console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is at the bottom. So no below node associated`);
            }
        }
        associateLeft(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x > 0) {
                //If it's not in the left-most row
                nodeToAssociate.nodeLeft = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x - 1, nodeToAssociate.gridCoordinate.y));
                console.log(`GridController::: The node to the left of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeLeft.gridCoordinate}`);
            }
            else {
                console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is flush to the left. So no node associated`);
            }
        }
        associateRight(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x < this._dimensionsInNodes.x - 1) {
                //If it's not in the right-most row
                nodeToAssociate.nodeAbove = this._gridNodes.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x + 1, nodeToAssociate.gridCoordinate.y));
                console.log(`GridController::: The node to the right of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
            }
            else {
                console.log(`GridController::: The node ${nodeToAssociate.gridCoordinate} is flush to the right. So no node associated`);
            }
        }
    }
    exports.GridController = GridController;
});
define("GravityBreak", ["require", "exports", "Grid/GridController"], function (require, exports, GridController_1) {
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
            let gridController = new GridController_1.GridController(10, 10);
        }
    }
    return GravityBreakGame;
});
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