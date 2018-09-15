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
define("Grid/NodeMeshFactory", ["require", "exports", "Grid/GridNode", "typescript-collections"], function (require, exports, GridNode_1, typescript_collections_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NodeMeshFactory {
        createNodeMeshOfDimensions(dimensionsInNodes) {
            this._dimensionsInNodes = dimensionsInNodes;
            this._nodeMesh = this.createUnassociatedNodeMesh(this._dimensionsInNodes);
            this.associateNodeMesh(this._nodeMesh);
            return this._nodeMesh;
        }
        createUnassociatedNodeMesh(_dimensionsInNodes) {
            let nodeMesh = new typescript_collections_1.Dictionary();
            for (let i = 0; i < _dimensionsInNodes.x; i++) {
                for (let j = 0; j < _dimensionsInNodes.y; j++) {
                    let node = new GridNode_1.GridNode(new Phaser.Point(i, j));
                    nodeMesh.setValue(node.gridCoordinate, node);
                    console.log(`NodeMeshFactory::: Created node with grid location ${node.gridCoordinate.x},${node.gridCoordinate.y}`);
                }
            }
            return nodeMesh;
        }
        associateNodeMesh(unassociatedNodeMesh) {
            //Loop through and link all of the created nodes to eachother
            unassociatedNodeMesh.forEach(this.associateNode.bind(this));
        }
        associateNode(gridCoordinate, nodeToAssociate) {
            console.log(`NodeMeshFactory::: Associating node at ${nodeToAssociate.gridCoordinate}`);
            this.associateAbove(nodeToAssociate);
            this.associateBelow(nodeToAssociate);
            this.associateLeft(nodeToAssociate);
            this.associateRight(nodeToAssociate);
        }
        associateAbove(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.y > 0) {
                //If it's not in the top row
                nodeToAssociate.nodeAbove = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y - 1));
                console.log(`NodeMeshFactory::: The node above node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is at the top. So no above node associated`);
            }
        }
        associateBelow(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.y < this._dimensionsInNodes.y - 1) {
                //If it's not in the bottom row
                nodeToAssociate.nodeBelow = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y + 1));
                console.log(`NodeMeshFactory::: The node below node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeBelow.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is at the bottom. So no below node associated`);
            }
        }
        associateLeft(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x > 0) {
                //If it's not in the left-most row
                nodeToAssociate.nodeLeft = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x - 1, nodeToAssociate.gridCoordinate.y));
                console.log(`NodeMeshFactory::: The node to the left of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeLeft.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is flush to the left. So no node associated`);
            }
        }
        associateRight(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x < this._dimensionsInNodes.x - 1) {
                //If it's not in the right-most row
                nodeToAssociate.nodeAbove = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x + 1, nodeToAssociate.gridCoordinate.y));
                console.log(`NodeMeshFactory::: The node to the right of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is flush to the right. So no node associated`);
            }
        }
    }
    exports.NodeMeshFactory = NodeMeshFactory;
});
define("Grid/GridController", ["require", "exports", "Grid/NodeMeshFactory"], function (require, exports, NodeMeshFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridController {
        constructor(nodesHigh, nodesWide) {
            let factory = new NodeMeshFactory_1.NodeMeshFactory();
            this._dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
            this._gridNodes = factory.createNodeMeshOfDimensions(this._dimensionsInNodes);
        }
    }
    exports.GridController = GridController;
});
define("System/View", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class View {
        //Important to note: I'm calling these contructor args 'injected' just to highlight that I'd 
        //use/create dependency injection here given more time.
        constructor(injectedGame, layerGroup) {
            this.game = injectedGame;
            this.layerGroup = layerGroup;
        }
    }
    exports.View = View;
});
define("System/Mediator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mediator {
        //Important to note: I'm calling these contructor args 'injected' just to highlight that I'd 
        //use/create dependency injection here given more time.
        constructor(injectedView) {
            this.view = injectedView;
        }
    }
    exports.Mediator = Mediator;
});
define("Block/BlockView", ["require", "exports", "System/View"], function (require, exports, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockView extends View_1.View {
        constructor(injectedGame, layerGroup) {
            super(injectedGame, layerGroup);
        }
    }
    exports.BlockView = BlockView;
});
define("Block/BlockMediator", ["require", "exports", "System/Mediator"], function (require, exports, Mediator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockMediator extends Mediator_1.Mediator {
        constructor(startingGridPosition, injectedView) {
            super(injectedView);
            this._blockView = this.view;
        }
    }
    exports.BlockMediator = BlockMediator;
});
define("Block/BlockFactory", ["require", "exports", "Block/BlockMediator", "Block/BlockView"], function (require, exports, BlockMediator_1, BlockView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockFactory {
        //We're going to use this starting point to setup BlockMediators and Views.
        //with absolutely everything they need.
        //It's also going to substitute as a VERY hamfisted Dependency Injector for those classes.
        //But as it also needs an instance of game, it's also going to need to be "injected" with "game".
        constructor(game, blockLayerGroup) {
            this._game = game;
            this._blocksLayerGroup = blockLayerGroup;
        }
        createBlockAtPosition(startingPosition) {
            let view = this.createBlockView();
            let mediator = new BlockMediator_1.BlockMediator(startingPosition, view);
            return mediator;
        }
        createBlockView() {
            let blockView = new BlockView_1.BlockView(this._game, this._blocksLayerGroup);
            return blockView;
        }
    }
    exports.BlockFactory = BlockFactory;
});
define("System/ISystemModel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("System/SystemModel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SystemModel {
        setBlockFactory(blockFactory) {
            this._blockFactory = blockFactory;
        }
        getBlockFactory() {
            return this._blockFactory;
        }
    }
    exports.SystemModel = SystemModel;
});
define("System/Startup", ["require", "exports", "Block/BlockFactory", "System/SystemModel", "Grid/GridController"], function (require, exports, BlockFactory_1, SystemModel_1, GridController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Startup {
        ////
        ///Perhaps we should separate Startup into 1: Bootstrap and 2: Initialise
        ///Don't really intend to create a full context so we can keep things close in here for the time being
        ///and then decide to split things apart if things get too tightly coupled
        constructor(game) {
            this._game = game;
        }
        initialiseGame() {
            this._systemModel = new SystemModel_1.SystemModel();
            this.bootstrapGame();
            this.initialiseGrid();
        }
        get systemModel() {
            return this._systemModel;
        }
        bootstrapGame() {
            this.bootstrapBlockFactory();
        }
        initialiseGrid() {
            let gridController = new GridController_1.GridController(10, 10);
            //YOU LEFT OFF: You were about to refactor GridController into Grid and GridFactory;
        }
        bootstrapBlockFactory() {
            let blockLayerGroup = this._game.add.group();
            let blockFactory = new BlockFactory_1.BlockFactory(this._game, blockLayerGroup);
            this._systemModel.setBlockFactory(blockFactory);
        }
    }
    exports.Startup = Startup;
});
define("GravityBreak", ["require", "exports", "System/Startup"], function (require, exports, Startup_1) {
    "use strict";
    class GravityBreakGame {
        constructor() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        }
        preload() {
            this.game.load.spritesheet("diamonds", "assets/diamonds32x5.png", 64, 64, 5);
            this.game.stage.backgroundColor = 0xB20059;
        }
        create() {
            let diamond = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'diamonds', 1);
            diamond.anchor.setTo(0.5, 0.5);
            let startup = new Startup_1.Startup(this.game);
            startup.initialiseGame();
        }
    }
    return GravityBreakGame;
});
//# sourceMappingURL=gravityBreak.js.map