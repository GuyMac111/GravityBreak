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
        constructor() {
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
        initialise(startingCoordinates) {
            this._diamondSprite = this.layerGroup.create(startingCoordinates.x, startingCoordinates.y, 'diamonds', 1);
            // this._diamondSprite.anchor.set(0.5,0.5);
        }
        moveToPosition(destinationCoordinates, onComplete) {
            let tween = this.game.add.tween(this._diamondSprite).to({
                x: destinationCoordinates.x,
                y: destinationCoordinates.y
            }, 200, Phaser.Easing.Linear.None);
            if (onComplete != undefined) {
                onComplete();
            }
        }
    }
    exports.BlockView = BlockView;
});
define("Block/BlockMediator", ["require", "exports", "System/Mediator"], function (require, exports, Mediator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockMediator extends Mediator_1.Mediator {
        constructor(startingGridPosition, injectedView) {
            super();
            this._blockView = injectedView;
            this._blockView.initialise(this.translateGridCoordsToWorld(startingGridPosition));
        }
        cascadeBlockTo(gridDestination) {
            this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.onBlockMoveComplete.bind(this));
            console.log("BlockMediator::: Block move started");
        }
        onBlockMoveComplete() {
            console.log("BlockMediator::: Block completed cascading");
            if (this.blockMoveComplete != null) {
                this.blockMoveComplete(this);
            }
        }
        translateGridCoordsToWorld(gridCoords) {
            return new Phaser.Point(gridCoords.x * 64, gridCoords.y * 64);
        }
    }
    exports.BlockMediator = BlockMediator;
});
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
        get isOccupied() {
            return this.currentBlock != undefined;
        }
    }
    exports.GridNode = GridNode;
});
define("Grid/NodeMesh", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //A class which contains all the associated nodes of a grid 
    //as well as the hidden 'spawn nodes' of said grid in a separate dict
    class NodeMesh {
        constructor(nodes, spawnNodes, dimensionsInNodes) {
            this._nodes = nodes;
            this._spawnNodes = spawnNodes;
            this._dimensionsInNodes = dimensionsInNodes;
        }
        get nodes() {
            return this._nodes;
        }
        get spawnNodes() {
            return this._spawnNodes;
        }
        get dimensionsInNodes() {
            return this._dimensionsInNodes;
        }
    }
    exports.NodeMesh = NodeMesh;
});
define("Grid/NodeMeshFactory", ["require", "exports", "Grid/GridNode", "typescript-collections", "Grid/NodeMesh"], function (require, exports, GridNode_1, typescript_collections_1, NodeMesh_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NodeMeshFactory {
        createNodeMesh(dimensionsInNodes) {
            this._dimensionsInNodes = dimensionsInNodes;
            this._nodeMesh = this.createUnassociatedNodeMesh(this._dimensionsInNodes);
            this._spawnNodeMesh = new typescript_collections_1.Dictionary();
            this.associateNodeMesh(this._nodeMesh);
            return new NodeMesh_1.NodeMesh(this._nodeMesh, this._spawnNodeMesh, this._dimensionsInNodes);
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
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is at the top. Creating spawn node above.`);
                let spawnNodeLocation = new Phaser.Point(nodeToAssociate.gridCoordinate.x, -1);
                this.createSecretSpawnNode(spawnNodeLocation);
            }
        }
        associateBelow(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.y < this._dimensionsInNodes.y - 1) {
                //If it's not in the bottom row
                nodeToAssociate.nodeBelow = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y + 1));
                console.log(`NodeMeshFactory::: The node below node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeBelow.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is at the bottom. Creating spawn node below.`);
                let spawnNodeLocation = new Phaser.Point(nodeToAssociate.gridCoordinate.x, this._dimensionsInNodes.y);
                this.createSecretSpawnNode(spawnNodeLocation);
            }
        }
        associateLeft(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x > 0) {
                //If it's not in the left-most row
                nodeToAssociate.nodeLeft = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x - 1, nodeToAssociate.gridCoordinate.y));
                console.log(`NodeMeshFactory::: The node to the left of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeLeft.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is flush to the left. Creating spawn node left.`);
                let spawnNodeLocation = new Phaser.Point(-1, nodeToAssociate.gridCoordinate.y);
                this.createSecretSpawnNode(spawnNodeLocation);
            }
        }
        associateRight(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x < this._dimensionsInNodes.x - 1) {
                //If it's not in the right-most row
                nodeToAssociate.nodeAbove = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x + 1, nodeToAssociate.gridCoordinate.y));
                console.log(`NodeMeshFactory::: The node to the right of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeAbove.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is flush to the left. Creating spawn node left.`);
                let spawnNodeLocation = new Phaser.Point(this._dimensionsInNodes.x, nodeToAssociate.gridCoordinate.y);
                this.createSecretSpawnNode(spawnNodeLocation);
            }
        }
        createSecretSpawnNode(nodeLocation) {
            this._spawnNodeMesh.setValue(nodeLocation, new GridNode_1.GridNode(nodeLocation));
        }
    }
    exports.NodeMeshFactory = NodeMeshFactory;
});
define("Cascade/SpawnData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SpawnData {
        constructor(spawnNode, destinationNode) {
            this._destinationNode = destinationNode;
            this._spawnNode = spawnNode;
        }
        get destination() {
            return this._destinationNode;
        }
        get spawnNode() {
            return this._spawnNode;
        }
    }
    exports.SpawnData = SpawnData;
});
define("Cascade/ICascadeStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Cascade/DownCascadeStrategy", ["require", "exports", "Cascade/SpawnData"], function (require, exports, SpawnData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DownCascadeStrategy {
        constructor(nodeMesh) {
            this._nodeMesh = nodeMesh;
        }
        shouldSpawnBlock() {
            return this.findNextUnoccupiedNode() != undefined;
        }
        getNextSpawn() {
            let destinationNode = this.findNextUnoccupiedNode();
            if (destinationNode == undefined) {
                throw new Error(`Something went wrong. Searching the grid for next unoccupied node to spawn to, but we got undefined`);
            }
            let spawnNodeCoords = new Phaser.Point(destinationNode.gridCoordinate.x, -1);
            //-1 because it's the invisible 'SpawnNode' at the top;
            return new SpawnData_1.SpawnData(this._nodeMesh.spawnNodes.getValue(spawnNodeCoords), destinationNode);
        }
        findNextUnoccupiedNode() {
            //this is naughty and unperformant, but we're going to iterate through a dictionary here
            //using corrdinates just because we know they exist. This is because doing things this way will
            //open the way for us to do fruity block generation in the future. 
            for (let j = this._nodeMesh.dimensionsInNodes.y - 1; j >= 0; j--) {
                //counting backwards, as we wanna check from the bottom up
                let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInRow(j);
                if (potentiallyUnoccupiedNode != undefined) {
                    return potentiallyUnoccupiedNode;
                }
            }
            return undefined;
        }
        //hmmmm....could probably go into a base class???
        getFirstUnoccupiedNodeInRow(j) {
            for (let i = 0; i < this._nodeMesh.dimensionsInNodes.x; i++) {
                let nodeToCheck = this._nodeMesh.nodes.getValue(new Phaser.Point(i, j));
                if (!nodeToCheck.isOccupied) {
                    return nodeToCheck;
                }
            }
            return undefined;
        }
    }
    exports.DownCascadeStrategy = DownCascadeStrategy;
});
define("Cascade/CascadeStrategyProvider", ["require", "exports", "Cascade/DownCascadeStrategy"], function (require, exports, DownCascadeStrategy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CascadeStrategyProvider {
        constructor(nodeMesh) {
            this.initialiseStrategies(nodeMesh);
        }
        get cascadeStrategy() {
            return this._downwardStrategy;
        }
        initialiseStrategies(nodeMesh) {
            this._downwardStrategy = new DownCascadeStrategy_1.DownCascadeStrategy(nodeMesh);
        }
    }
    exports.CascadeStrategyProvider = CascadeStrategyProvider;
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
define("Grid/GridController", ["require", "exports", "Grid/NodeMeshFactory", "Cascade/CascadeStrategyProvider"], function (require, exports, NodeMeshFactory_1, CascadeStrategyProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridController {
        constructor(nodesHigh, nodesWide, injectedBlockFactory) {
            let dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
            this._blockFactory = injectedBlockFactory;
            //TODO: move instantiation of NodeMeshFactory into bootstrap and 'inject'
            let nodeMeshFactory = new NodeMeshFactory_1.NodeMeshFactory();
            this._gridNodes = nodeMeshFactory.createNodeMesh(dimensionsInNodes);
            this._cascadeStrategyProvider = new CascadeStrategyProvider_1.CascadeStrategyProvider(this._gridNodes);
        }
        //TODO: using strategy provider we should now attempt filling the grid.
        initialiseGrid() {
            //Lets temporarliy use this func as our fall function...just for testing :)
            let cascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
            //TODO:: hmmmm....Maybe remove this check and just check here for undefined?
            if (cascadeStrategy.shouldSpawnBlock) {
                let spawnData = cascadeStrategy.getNextSpawn();
                let block = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
                block.blockMoveComplete = this.onBlockFallComplete.bind(this);
                //Set the node's reference here so it can be omitted from future checks
                spawnData.destination.currentBlock = block;
                block.cascadeBlockTo(spawnData.destination.gridCoordinate);
            }
            else {
                //Our grid should be full at this point
                console.log("GridController::: Our grid is fully cascaded.....supposedly.");
            }
        }
        onBlockFallComplete(completedBlock) {
            console.log("GridController::: Block move complete acknowledged.");
            completedBlock.blockMoveComplete = undefined;
            this.initialiseGrid();
        }
    }
    exports.GridController = GridController;
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
        //TODO:: Setup interface so that this becomes a getter. 
        //Having multiple patterns across such a small project is NOT a good look.
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
            let gridController = new GridController_1.GridController(10, 10, this._systemModel.getBlockFactory());
            gridController.initialiseGrid();
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
            // let diamond = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY,'diamonds',1);
            // diamond.anchor.setTo( 0.5, 0.5 );
            let startup = new Startup_1.Startup(this.game);
            startup.initialiseGame();
        }
    }
    return GravityBreakGame;
});
//# sourceMappingURL=gravityBreak.js.map