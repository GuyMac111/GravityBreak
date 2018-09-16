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
define("Block/BlockColour", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlockColour;
    (function (BlockColour) {
        BlockColour[BlockColour["Red"] = 0] = "Red";
        BlockColour[BlockColour["Yellow"] = 1] = "Yellow";
        BlockColour[BlockColour["Green"] = 2] = "Green";
        BlockColour[BlockColour["Purple"] = 3] = "Purple";
        BlockColour[BlockColour["Blue"] = 4] = "Blue";
    })(BlockColour = exports.BlockColour || (exports.BlockColour = {}));
});
define("Block/BlockView", ["require", "exports", "System/View"], function (require, exports, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockView extends View_1.View {
        constructor(injectedGame, layerGroup) {
            super(injectedGame, layerGroup);
        }
        initialise(startingCoordinates, colour) {
            this._diamondSprite = this.layerGroup.create(startingCoordinates.x, startingCoordinates.y, 'diamonds', colour);
        }
        moveToPosition(destinationCoordinates, onComplete) {
            let tween = this.game.add.tween(this._diamondSprite).to({
                x: destinationCoordinates.x,
                y: destinationCoordinates.y
            }, 100, Phaser.Easing.Linear.None);
            if (onComplete != undefined) {
                tween.onComplete.add(onComplete);
            }
            tween.start();
        }
    }
    exports.BlockView = BlockView;
});
define("Block/BlockMediator", ["require", "exports", "System/Mediator"], function (require, exports, Mediator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockMediator extends Mediator_1.Mediator {
        constructor(startingGridPosition, colour, injectedView) {
            super();
            this._blockView = injectedView;
            this._blockColour = colour;
            this._blockView.initialise(this.translateGridCoordsToWorld(startingGridPosition), this._blockColour);
        }
        cascadeBlockTo(gridDestination) {
            this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.onBlockMoveComplete.bind(this));
        }
        onBlockMoveComplete() {
            console.log("BlockMediator.onBlockMoveComplete()::: Block completed cascading");
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
        get shouldSpawnBlock() {
            return this.findNextUnoccupiedNode() != undefined;
        }
        get nextSpawn() {
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
define("Block/BlockFactory", ["require", "exports", "Block/BlockMediator", "Block/BlockView", "Block/BlockColour"], function (require, exports, BlockMediator_1, BlockView_1, BlockColour_1) {
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
            let mediator = new BlockMediator_1.BlockMediator(startingPosition, this.generateRandomColour(), view);
            return mediator;
        }
        generateRandomColour() {
            //hacky solution for randomising between enum values. WILL fail on string enums.
            let numEnumValues = Object.keys(BlockColour_1.BlockColour).length / 2;
            let randomEnumInt = Math.floor(Math.random() * numEnumValues);
            return randomEnumInt;
        }
        createBlockView() {
            let blockView = new BlockView_1.BlockView(this._game, this._blocksLayerGroup);
            return blockView;
        }
    }
    exports.BlockFactory = BlockFactory;
});
define("System/Events/EventHub", ["require", "exports", "typescript-collections"], function (require, exports, typescript_collections_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventHub {
        constructor() {
            this._eventMap = new typescript_collections_2.Dictionary();
        }
        //First REALLY naughty thing we've done. We just have to be careful with the messages we send with our events.
        addEventListener(eventType, handler, handleFunction) {
            if (!this._eventMap.containsKey(eventType)) {
                this._eventMap.setValue(eventType, new ListenersList());
            }
            let listenersForEvent = this._eventMap.getValue(eventType);
            listenersForEvent.addListener(handler, handleFunction);
        }
        removeEventListener(eventType, handler) {
            if (!this._eventMap.containsKey(eventType)) {
                return;
            }
            else {
                this._eventMap.getValue(eventType).removeListener(handler);
            }
        }
        dispatchEvent(eventType, message) {
            if (!this._eventMap.containsKey(eventType)) {
                return;
            }
            else {
                this._eventMap.getValue(eventType).dispatchAll(message);
            }
        }
    }
    exports.EventHub = EventHub;
    class ListenersList {
        constructor() {
            this._listenerCallbackMap = new typescript_collections_2.Dictionary();
        }
        addListener(handler, handleFunction) {
            this._listenerCallbackMap.setValue(handler, handleFunction);
        }
        removeListener(handler) {
            if (this._listenerCallbackMap.containsKey(handler)) {
                this._listenerCallbackMap.remove(handler);
            }
        }
        dispatchAll(message) {
            this._listenerCallbackMap.forEach((handler, handleFunction) => {
                if (message != undefined) {
                    handleFunction(message);
                }
                else {
                    handleFunction();
                }
            });
        }
    }
});
define("System/Events/EventHandler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventHandler {
        constructor(injectedEventHub) {
            this._eventHub = injectedEventHub;
        }
        addEventListener(eventType, onEvent) {
            this._eventHub.addEventListener(eventType, this, onEvent);
        }
        removeEventListener(eventType) {
            this._eventHub.removeEventListener(eventType, this);
        }
        //hmmmm....COULD move this into a child class explicitly designated 'Dispatcher' in order to truly distinguish between the two for clarity.
        dispatchEvent(eventType, message) {
            this._eventHub.dispatchEvent(eventType, message);
        }
    }
    exports.EventHandler = EventHandler;
});
define("Grid/GridEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridEvents {
    }
    GridEvents.InitialiseGridEvent = "GridEvent.InitialiseGrid";
    exports.GridEvents = GridEvents;
});
define("Grid/GridController", ["require", "exports", "Grid/NodeMeshFactory", "Cascade/CascadeStrategyProvider", "System/Events/EventHandler", "Grid/GridEvents"], function (require, exports, NodeMeshFactory_1, CascadeStrategyProvider_1, EventHandler_1, GridEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridController extends EventHandler_1.EventHandler {
        constructor(nodesHigh, nodesWide, injectedBlockFactory, injectedEventHub) {
            super(injectedEventHub);
            this.addEventListener(GridEvents_1.GridEvents.InitialiseGridEvent, this.onInitialiseEvent.bind(this));
            let dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
            this._blockFactory = injectedBlockFactory;
            //TODO: move instantiation of NodeMeshFactory into bootstrap and 'inject'
            let nodeMeshFactory = new NodeMeshFactory_1.NodeMeshFactory();
            this._gridNodes = nodeMeshFactory.createNodeMesh(dimensionsInNodes);
            this._cascadeStrategyProvider = new CascadeStrategyProvider_1.CascadeStrategyProvider(this._gridNodes);
        }
        onInitialiseEvent() {
            console.log("GridController.onInitialiseEvent()::: Initialise event received");
            this.fillGrid();
        }
        fillGrid() {
            this.spawnBlocks();
        }
        spawnBlocks() {
            //Lets temporarliy use this func as our fall function...just for testing :)
            let cascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
            //TODO:: hmmmm....Maybe remove this check and just check here for undefined?
            if (cascadeStrategy.shouldSpawnBlock) {
                let spawnData = cascadeStrategy.nextSpawn;
                let block = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
                block.blockMoveComplete = this.onBlockSpawnComplete.bind(this);
                //Set the node's reference here so it can be omitted from future checks
                spawnData.destination.currentBlock = block;
                console.log(`GridController.spawnBlocks()::: Block move started (initial position ${spawnData.spawnNode.gridCoordinate.x},${spawnData.spawnNode.gridCoordinate.y})`);
                block.cascadeBlockTo(spawnData.destination.gridCoordinate);
            }
            else {
                //Our grid should be full at this point
                console.log("GridController.spawnBlocks()::: Our grid is fully cascaded.....supposedly.");
            }
        }
        onBlockSpawnComplete(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            this.spawnBlocks();
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
        set blockFactory(blockFactory) {
            this._blockFactory = blockFactory;
        }
        get blockFactory() {
            return this._blockFactory;
        }
        set eventHub(eventHub) {
            this._eventHub = eventHub;
        }
        get eventHub() {
            return this._eventHub;
        }
    }
    exports.SystemModel = SystemModel;
});
define("System/Startup", ["require", "exports", "Block/BlockFactory", "System/SystemModel", "Grid/GridController", "System/Events/EventHub", "Grid/GridEvents"], function (require, exports, BlockFactory_1, SystemModel_1, GridController_1, EventHub_1, GridEvents_2) {
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
            this.initialise();
        }
        initialise() {
            let gridController = new GridController_1.GridController(9, 9, this._systemModel.blockFactory, this._systemModel.eventHub);
            this.systemModel.eventHub.dispatchEvent(GridEvents_2.GridEvents.InitialiseGridEvent);
        }
        bootstrapGame() {
            this.bootstrapEventHub();
            this.bootstrapBlockFactory();
        }
        bootstrapEventHub() {
            let eventHub = new EventHub_1.EventHub();
            this._systemModel.eventHub = eventHub;
        }
        bootstrapBlockFactory() {
            let blockLayerGroup = this._game.add.group();
            let blockFactory = new BlockFactory_1.BlockFactory(this._game, blockLayerGroup);
            this._systemModel.blockFactory = blockFactory;
        }
        get systemModel() {
            return this._systemModel;
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