define("System/Events/EventHub", ["require", "exports", "typescript-collections"], function (require, exports, typescript_collections_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventHub {
        constructor() {
            this._eventMap = new typescript_collections_1.Dictionary();
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
            this._listenerCallbackMap = new typescript_collections_1.Dictionary();
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
define("System/Mediator", ["require", "exports", "System/Events/EventHandler"], function (require, exports, EventHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mediator extends EventHandler_1.EventHandler {
        //Important to note: I'm calling these contructor args 'injected' just to highlight that I'd 
        //use/create dependency injection here given more time.
        constructor(injectedEventHub) {
            super(injectedEventHub);
        }
    }
    exports.Mediator = Mediator;
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
            this.SELECTION_SPEED = 200;
            this.GRID_OFFSET = 32; //We know the blocks are square and we want them at their center.
        }
        initialise(startingGridCoordinates, colour) {
            let startingCoords = this.translateGridCoordsToWorld(startingGridCoordinates);
            this._diamondSprite = this.layerGroup.create(startingCoords.x, startingCoords.y, 'diamonds', colour);
            this._diamondSprite.anchor = new Phaser.Point(0.5, 0.5);
            this._diamondSprite.inputEnabled = true;
            this._diamondSprite.events.onInputDown.add(this.onBlockTouched, this);
        }
        moveToPosition(destinationGridCoordinates, speed, onComplete) {
            let dest = this.translateGridCoordsToWorld(destinationGridCoordinates);
            let tween = this.game.add.tween(this._diamondSprite).to({
                x: dest.x,
                y: dest.y
            }, speed, Phaser.Easing.Linear.None);
            if (onComplete != undefined) {
                tween.onComplete.add(onComplete);
            }
            tween.start();
        }
        cascadeToPosition(destinationGridCoordinates, speed, onComplete) {
            let dest = this.translateGridCoordsToWorld(destinationGridCoordinates);
            let tween = this.game.add.tween(this._diamondSprite).to({
                x: dest.x,
                y: dest.y
            }, speed, Phaser.Easing.Cubic.In);
            if (onComplete != undefined) {
                tween.onComplete.add(onComplete);
            }
            tween.start();
        }
        showBlockSelected() {
            let tween = this.game.add.tween(this._diamondSprite.scale).to({
                x: 1.2,
                y: 1.2
            }, this.SELECTION_SPEED, Phaser.Easing.Bounce.Out);
            tween.start();
        }
        showBlockUnselected() {
            let tween = this.game.add.tween(this._diamondSprite.scale).to({
                x: 1,
                y: 1
            }, this.SELECTION_SPEED, Phaser.Easing.Bounce.Out);
            tween.start();
        }
        showBlockDestroyAnimation(delay, onComplete) {
            let horizTween = this.game.add.tween(this._diamondSprite.scale).to({ x: 1.25, y: 0.05 }, 300, Phaser.Easing.Elastic.Out, false, delay);
            let vertTween = this.game.add.tween(this._diamondSprite.scale).to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None, false, 50);
            vertTween.onComplete.add(onComplete);
            horizTween.chain(vertTween);
            horizTween.start();
        }
        destroySpriteInstance() {
            this._diamondSprite.destroy();
        }
        onBlockTouched() {
            if (this.onTouch != undefined) {
                this.onTouch();
            }
        }
        translateGridCoordsToWorld(gridCoords) {
            return new Phaser.Point(gridCoords.x * 64 + this.GRID_OFFSET, gridCoords.y * 64 + this.GRID_OFFSET);
        }
    }
    exports.BlockView = BlockView;
});
define("Block/BlockEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockEvents {
    }
    BlockEvents.BlockTouchedEvent = "BlockEvents.BlockTouched";
    exports.BlockEvents = BlockEvents;
});
define("Block/BlockMediator", ["require", "exports", "System/Mediator", "Block/BlockEvents"], function (require, exports, Mediator_1, BlockEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockMediator extends Mediator_1.Mediator {
        constructor(startingGridPosition, colour, injectedView, injectedEventHub) {
            super(injectedEventHub);
            this.SPAWN_DURATION = 7;
            this.RESPAWN_DURATION = 50;
            this.SWAP_DURATION = 100;
            this.CASCADE_DURATION = 200;
            this._isLastBlockToCascade = false;
            this._blockView = injectedView;
            this._blockColour = colour;
            this._blockView.initialise(startingGridPosition, this._blockColour);
            this._blockView.onTouch = this.onViewTouched.bind(this);
        }
        spawnBlockTo(gridDestination) {
            this._blockView.moveToPosition(gridDestination, this.SPAWN_DURATION, this.onBlockMoveComplete.bind(this));
        }
        respawnBlockTo(gridDestination) {
            this._blockView.moveToPosition(gridDestination, this.RESPAWN_DURATION, this.onBlockMoveComplete.bind(this));
        }
        swapBlockTo(gridDestination) {
            this._blockView.moveToPosition(gridDestination, this.SWAP_DURATION, this.onBlockMoveComplete.bind(this));
        }
        cascadeBlockTo(gridDestination, isLastBlockToCascade) {
            this._isLastBlockToCascade = isLastBlockToCascade;
            this._cascadeDestination = gridDestination;
            this._blockView.moveToPosition(gridDestination, this.CASCADE_DURATION, this.onCascadeMovementComplete.bind(this));
        }
        onCascadeMovementComplete() {
            let lastToCascade = this._isLastBlockToCascade;
            let destination = this._cascadeDestination;
            this.blockCascadeComplete(destination, this, lastToCascade);
            this._cascadeDestination = undefined;
            this._isLastBlockToCascade = false;
        }
        onBlockMoveComplete() {
            if (this.blockMoveComplete != null) {
                this.blockMoveComplete(this);
            }
        }
        showBlockSelected() {
            this._blockView.showBlockSelected();
        }
        showBlockUnselected() {
            this._blockView.showBlockUnselected();
        }
        showBlockDestroyAnimation(delay) {
            this._blockView.showBlockDestroyAnimation(delay, this.onBlockDestroyComplete.bind(this));
        }
        onBlockDestroyComplete() {
            this._blockView.destroySpriteInstance();
            if (this.blockDestroyComplete != undefined) {
                this.blockDestroyComplete(this);
            }
        }
        get blockColour() {
            return this._blockColour;
        }
        onViewTouched() {
            if (this.currentNode != undefined) {
                this.dispatchEvent(BlockEvents_1.BlockEvents.BlockTouchedEvent, this.currentNode.gridCoordinate);
            }
        }
    }
    exports.BlockMediator = BlockMediator;
});
define("Grid/GridNode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridNode {
        constructor(gridCoordinate) {
            this._nodeAbove = undefined;
            this._nodeBelow = undefined;
            this._nodeLeft = undefined;
            this._nodeRight = undefined;
            this._gridCoordinate = new Phaser.Point(gridCoordinate.x, gridCoordinate.y);
        }
        releaseBlock() {
            this._currentBlock.currentNode = undefined;
            this._currentBlock = undefined;
        }
        assignBlock(block) {
            this._currentBlock = block;
            this._currentBlock.currentNode = this;
        }
        getCurrentBlock() {
            return this._currentBlock;
        }
        get nodeAbove() {
            return this._nodeAbove;
        }
        get nodeBelow() {
            return this._nodeBelow;
        }
        get nodeLeft() {
            return this._nodeLeft;
        }
        get nodeRight() {
            return this._nodeRight;
        }
        set nodeAbove(node) {
            this._nodeAbove = node;
        }
        set nodeBelow(node) {
            this._nodeBelow = node;
        }
        set nodeLeft(node) {
            this._nodeLeft = node;
        }
        set nodeRight(node) {
            this._nodeRight = node;
        }
        get gridCoordinate() {
            return this._gridCoordinate;
        }
        get isOccupied() {
            return this._currentBlock != undefined;
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
define("Grid/NodeMeshFactory", ["require", "exports", "Grid/GridNode", "typescript-collections", "Grid/NodeMesh"], function (require, exports, GridNode_1, typescript_collections_2, NodeMesh_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NodeMeshFactory {
        createNodeMesh(dimensionsInNodes) {
            this._dimensionsInNodes = dimensionsInNodes;
            this._nodeMesh = this.createUnassociatedNodeMesh(this._dimensionsInNodes);
            this._spawnNodeMesh = new typescript_collections_2.Dictionary();
            this.associateNodeMesh(this._nodeMesh);
            return new NodeMesh_1.NodeMesh(this._nodeMesh, this._spawnNodeMesh, this._dimensionsInNodes);
        }
        createUnassociatedNodeMesh(_dimensionsInNodes) {
            let toStr = (key) => {
                return `${key.x},${key.y}`;
            };
            let nodeMesh = new typescript_collections_2.Dictionary(toStr);
            for (let i = 0; i < _dimensionsInNodes.x; i++) {
                for (let j = 0; j < _dimensionsInNodes.y; j++) {
                    let node = new GridNode_1.GridNode(new Phaser.Point(i, j));
                    if (nodeMesh.containsKey(node.gridCoordinate)) {
                        console.log("COLLISION");
                    }
                    nodeMesh.setValue(node.gridCoordinate, node);
                }
            }
            return nodeMesh;
        }
        associateNodeMesh(unassociatedNodeMesh) {
            //Loop through and link all of the created nodes to eachother
            unassociatedNodeMesh.forEach(this.associateNode.bind(this));
        }
        associateNode(gridCoordinate, nodeToAssociate) {
            this.associateAbove(nodeToAssociate);
            this.associateBelow(nodeToAssociate);
            this.associateLeft(nodeToAssociate);
            this.associateRight(nodeToAssociate);
        }
        associateAbove(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.y > 0) {
                //If it's not in the top row
                nodeToAssociate.nodeAbove = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y - 1));
            }
            else {
                let spawnNodeLocation = new Phaser.Point(nodeToAssociate.gridCoordinate.x, -1);
                this.createSecretSpawnNode(spawnNodeLocation);
            }
        }
        associateBelow(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.y < this._dimensionsInNodes.y - 1) {
                //If it's not in the bottom row
                nodeToAssociate.nodeBelow = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x, nodeToAssociate.gridCoordinate.y + 1));
            }
            else {
                let spawnNodeLocation = new Phaser.Point(nodeToAssociate.gridCoordinate.x, this._dimensionsInNodes.y);
                this.createSecretSpawnNode(spawnNodeLocation);
            }
        }
        associateLeft(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x > 0) {
                //If it's not in the left-most row
                nodeToAssociate.nodeLeft = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x - 1, nodeToAssociate.gridCoordinate.y));
            }
            else {
                let spawnNodeLocation = new Phaser.Point(-1, nodeToAssociate.gridCoordinate.y);
                this.createSecretSpawnNode(spawnNodeLocation);
            }
        }
        associateRight(nodeToAssociate) {
            if (nodeToAssociate.gridCoordinate.x < this._dimensionsInNodes.x - 1) {
                //If it's not in the right-most row
                nodeToAssociate.nodeRight = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x + 1, nodeToAssociate.gridCoordinate.y));
            }
            else {
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
define("Grid/VOs/CascadeVO", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CascadeVO {
        constructor(cascadingBlock, destination) {
            this._cascadingBlock = cascadingBlock;
            this._destination = destination;
        }
        get cascadingBlock() {
            return this._cascadingBlock;
        }
        get destination() {
            return this._destination;
        }
    }
    exports.CascadeVO = CascadeVO;
});
define("Cascade/ICascadeStrategy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Cascade/DownCascadeStrategy", ["require", "exports", "Cascade/SpawnData", "Grid/VOs/CascadeVO"], function (require, exports, SpawnData_1, CascadeVO_1) {
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
        get blocksToCascade() {
            return this.getCascadeDataForGrid();
        }
        getCascadeDataForGrid() {
            let result = [];
            this._nodeMesh.nodes.forEach((coord, node) => {
                let cascadeDataForNode = this.getCascadeDataForNode(node);
                if (cascadeDataForNode != undefined) {
                    result.push(cascadeDataForNode);
                }
            });
            return result;
        }
        getCascadeDataForNode(node) {
            let distanceToCascade = this.getNumberOfEmptyNodesBelowNode(node, 0);
            if (node.isOccupied) {
                let cascadeDestination = new Phaser.Point(node.gridCoordinate.x, node.gridCoordinate.y + distanceToCascade);
                let cascadeVO = new CascadeVO_1.CascadeVO(node.getCurrentBlock(), cascadeDestination);
                return cascadeVO;
            }
            else {
                return undefined;
            }
        }
        getNumberOfEmptyNodesBelowNode(node, emptyNodes) {
            if (!node.isOccupied) {
                emptyNodes++;
            }
            if (node.nodeBelow != undefined) {
                return this.getNumberOfEmptyNodesBelowNode(node.nodeBelow, emptyNodes);
            }
            else {
                return emptyNodes;
            }
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
        constructor(game, blockLayerGroup, injectedEventHub) {
            this._game = game;
            this._blocksLayerGroup = blockLayerGroup;
            this._eventHub = injectedEventHub;
        }
        createBlockAtPosition(startingPosition) {
            let view = this.createBlockView();
            let mediator = new BlockMediator_1.BlockMediator(startingPosition, this.generateRandomColour(), view, this._eventHub);
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
define("Grid/GridEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridEvents {
    }
    GridEvents.InitialiseGridEvent = "GridEvent.InitialiseGrid";
    GridEvents.InitialiseGridCompleteEvent = "GridEvent.InitialiseGridComplete";
    GridEvents.ShowBlockSelectedEvent = "GridEvent.ShowBlockSelected";
    GridEvents.ShowBlockUnselectedEvent = "GridEvent.ShowBlockUnselected";
    GridEvents.ShowBlockSwapAnimationEvent = "GridEvent.ShowBlockSwapAnimation";
    GridEvents.SelectedBlockSwapAnimationCompleteEvent = "GridEvent.SelectedBlockSwapAnimationComplete";
    GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent = "GridEvent.SwapCandidateBlockSwapAnimationComplete";
    GridEvents.BlockSwapAnimationCompleteEvent = "GridEvent.BlockSwapAnimationComplete";
    GridEvents.EvaluateGridEvent = "GridEvent.EvaluateGrid";
    GridEvents.GridEvaluationPositiveEvent = "GridEvent.GridEvalutationPositive";
    GridEvents.GridEvaluationNegativeEvent = "GridEvent.GridEvalutationNegative";
    GridEvents.BreakAndCascadeBlocksEvent = "GridEvent.BreakAndCascadeBlocks";
    GridEvents.BreakAndCascadeBlocksCompleteEvent = "GridEvent.BreakAndCascadeBlocksComplete";
    GridEvents.RefillGridEvent = "GridEvent.RefillGrid";
    GridEvents.RefillGridCompleteEvent = "GridEvent.RefillGridComplete";
    exports.GridEvents = GridEvents;
});
define("Grid/VOs/SwapVO", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SwapVO {
        constructor(firstBlockCoord, secondBlockCoord) {
            this._firstBlockCoord = firstBlockCoord;
            this._secondBlockCoord = secondBlockCoord;
        }
        get firstBlockCoord() {
            return this._firstBlockCoord;
        }
        get secondBlockCoord() {
            return this._secondBlockCoord;
        }
    }
    exports.SwapVO = SwapVO;
});
define("Grid/VOs/BreakVO", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BreakVO {
        constructor(coords) {
            this._coords = coords;
        }
        get coords() {
            return this._coords;
        }
    }
    exports.BreakVO = BreakVO;
});
define("Grid/GridController", ["require", "exports", "Cascade/CascadeStrategyProvider", "System/Events/EventHandler", "Grid/GridEvents", "Grid/VOs/SwapVO"], function (require, exports, CascadeStrategyProvider_1, EventHandler_2, GridEvents_1, SwapVO_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridController extends EventHandler_2.EventHandler {
        constructor(nodesHigh, nodesWide, injectedBlockFactory, injectedEventHub, injectedNodeMesh) {
            super(injectedEventHub);
            this.addEventListener(GridEvents_1.GridEvents.InitialiseGridEvent, this.onInitialiseEvent.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.ShowBlockSelectedEvent, this.onShowBlockSelectedEvent.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.ShowBlockUnselectedEvent, this.onShowBlockUnselectedEvent.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.ShowBlockSwapAnimationEvent, this.onShowBlockSwapAnimationEvent.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.BreakAndCascadeBlocksEvent, this.onBreakBlocksEvent.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.RefillGridEvent, this.onRefillGridEvent.bind(this));
            let dimensionsInNodes = new Phaser.Point(nodesWide, nodesHigh);
            this._blockFactory = injectedBlockFactory;
            //TODO: move instantiation of NodeMeshFactory into bootstrap and 'inject'
            this._gridNodes = injectedNodeMesh;
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
            let cascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
            if (cascadeStrategy.shouldSpawnBlock) {
                let spawnData = cascadeStrategy.nextSpawn;
                let block = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
                block.blockMoveComplete = this.onBlockSpawnCompleteCallback.bind(this);
                spawnData.destination.assignBlock(block);
                block.spawnBlockTo(spawnData.destination.gridCoordinate);
            }
            else {
                this.dispatchEvent(GridEvents_1.GridEvents.InitialiseGridCompleteEvent);
                console.log("GridController.spawnBlocks()::: Our grid is full");
            }
        }
        onBlockSpawnCompleteCallback(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            this.spawnBlocks();
        }
        onBreakBlocksEvent(message) {
            console.log("GridController.onBreakBlocksEvent():::");
            let breakDelay = 400;
            let breakVos = message;
            for (let i = 0; i < breakVos.length; i++) {
                let coords = breakVos[i].coords.toArray();
                for (let j = 0; j < coords.length; j++) {
                    let coord = coords[j];
                    let nodeAtCoord = this._gridNodes.nodes.getValue(coord);
                    let blockMed = nodeAtCoord.getCurrentBlock();
                    nodeAtCoord.releaseBlock();
                    console.log(`BreakNode: ${nodeAtCoord.gridCoordinate}`);
                    let firstCoordOfFinalVO = breakVos[breakVos.length - 1].coords.toArray()[0];
                    if (coord == firstCoordOfFinalVO) {
                        //We came up with a better way to do this in cascadeBlocks() (this, being figure out when we're done)
                        blockMed.blockDestroyComplete = this.onFinalBlockDestroyComplete.bind(this);
                    }
                    blockMed.showBlockDestroyAnimation(i * breakDelay);
                }
            }
        }
        onFinalBlockDestroyComplete(blockMediator) {
            blockMediator.blockDestroyComplete = undefined;
            console.log("GridController.onFinalBlockDestroyComplete()");
            this.cascadeBlocks();
        }
        cascadeBlocks() {
            console.log("GridController.cascadeBlocks()");
            let cascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
            let blocksToCascade = cascadeStrategy.blocksToCascade;
            if (blocksToCascade.length > 0) {
                for (let i = 0; i < blocksToCascade.length; i++) {
                    let cascadeVO = blocksToCascade[i];
                    let cascadingBlock = cascadeVO.cascadingBlock;
                    //ALL nodes cascade, even if their distance is zero.
                    //ALL nodes release their nodes when cascading begins.
                    cascadingBlock.currentNode.releaseBlock();
                    cascadingBlock.blockCascadeComplete = this.onEachBlockCascadeComplete.bind(this);
                    cascadingBlock.cascadeBlockTo(cascadeVO.destination, (i == blocksToCascade.length - 1));
                }
            }
            else {
                console.log("Dispatching BreakAndCascadeBlocksCompleteEvent due to there being nothing to cascade.");
                this.dispatchEvent(GridEvents_1.GridEvents.BreakAndCascadeBlocksCompleteEvent, this._gridNodes);
            }
        }
        onEachBlockCascadeComplete(destinationCoord, fallenBlock, wasLastBlockToCascade) {
            //All blocks reassign to their destination node on animation complete
            let destinationNode = this._gridNodes.nodes.getValue(destinationCoord);
            destinationNode.assignBlock(fallenBlock);
            if (wasLastBlockToCascade) {
                this.onLastBlockCascadeComplete();
            }
        }
        onLastBlockCascadeComplete() {
            console.log("Dispatching BreakAndCascadeBlocksCompleteEvent due to final animation complete.");
            this.dispatchEvent(GridEvents_1.GridEvents.BreakAndCascadeBlocksCompleteEvent, this._gridNodes);
        }
        onShowBlockSwapAnimationEvent(message) {
            if (message instanceof SwapVO_1.SwapVO) {
                let swapVO = message;
                this.swapBlocks(swapVO.firstBlockCoord, swapVO.secondBlockCoord);
            }
        }
        swapBlocks(firstGridCoord, secondGridCoord) {
            let firstNode = this._gridNodes.nodes.getValue(firstGridCoord);
            let secondNode = this._gridNodes.nodes.getValue(secondGridCoord);
            let firstBlock = firstNode.getCurrentBlock();
            let secondBlock = secondNode.getCurrentBlock();
            firstNode.releaseBlock();
            secondNode.releaseBlock();
            firstNode.assignBlock(secondBlock);
            secondNode.assignBlock(firstBlock);
            secondBlock.blockMoveComplete = this.onSwapCandidateBlockMoveComplete.bind(this);
            firstBlock.blockMoveComplete = this.onSelectedBlockMoveComplete.bind(this);
            secondBlock.swapBlockTo(firstGridCoord);
            firstBlock.swapBlockTo(secondGridCoord);
        }
        onRefillGridEvent() {
            this.respawnBlocks();
        }
        respawnBlocks() {
            let cascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
            if (cascadeStrategy.shouldSpawnBlock) {
                let spawnData = cascadeStrategy.nextSpawn;
                let block = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
                block.blockMoveComplete = this.onBlockReSpawnCompleteCallback.bind(this);
                spawnData.destination.assignBlock(block);
                block.respawnBlockTo(spawnData.destination.gridCoordinate);
            }
            else {
                console.log("GridController.respawnBlocks()::: Our grid is full");
                this.dispatchEvent(GridEvents_1.GridEvents.RefillGridCompleteEvent);
            }
        }
        onBlockReSpawnCompleteCallback(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            this.respawnBlocks();
        }
        onSelectedBlockMoveComplete(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
            this.dispatchEvent(GridEvents_1.GridEvents.SelectedBlockSwapAnimationCompleteEvent, this._gridNodes);
        }
        onSwapCandidateBlockMoveComplete(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
            this.dispatchEvent(GridEvents_1.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this._gridNodes);
        }
        onShowBlockSelectedEvent(message) {
            if (message instanceof Phaser.Point) {
                this._gridNodes.nodes.getValue(message).getCurrentBlock().showBlockSelected();
            }
        }
        onShowBlockUnselectedEvent(message) {
            if (message instanceof Phaser.Point) {
                this._gridNodes.nodes.getValue(message).getCurrentBlock().showBlockUnselected();
            }
        }
    }
    exports.GridController = GridController;
});
define("Input/InputEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InputEvents {
    }
    InputEvents.EnableInputsEvent = "InputEvents.EnableInputs";
    InputEvents.DisableInputsEvent = "InputEvents.DisableInputs";
    exports.InputEvents = InputEvents;
});
define("Grid/GridModel", ["require", "exports", "System/Events/EventHandler", "Grid/GridEvents", "Grid/VOs/SwapVO", "Input/InputEvents"], function (require, exports, EventHandler_3, GridEvents_2, SwapVO_2, InputEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridModel extends EventHandler_3.EventHandler {
        constructor(injectedEventHub) {
            super(injectedEventHub);
            this._selectedBlockSwapAnimationComplete = false;
            this._swapCandidateBlockSwapAnimationComplete = false;
            this.addEventListener(GridEvents_2.GridEvents.InitialiseGridCompleteEvent, this.onGridInitialisedEvent.bind(this));
        }
        get hasCurrentlySelectedBlock() {
            return this._currentlySelectedCoord != undefined;
        }
        selectBlock(coord) {
            if (this._currentlySelectedCoord == undefined) {
                this._currentlySelectedCoord = coord;
                this.dispatchEvent(GridEvents_2.GridEvents.ShowBlockSelectedEvent, this._currentlySelectedCoord);
            }
            else if (coord == this._currentlySelectedCoord) {
                this.deselectAll();
            }
            else {
                if (this.blockIsLegalSwapCandidate(coord)) {
                    this._swapCandidateCoord = coord;
                    let payload = new SwapVO_2.SwapVO(this._currentlySelectedCoord, this._swapCandidateCoord);
                    this.dispatchEvent(InputEvents_1.InputEvents.DisableInputsEvent);
                    this.addBlockSwapEventListeners();
                    this.dispatchEvent(GridEvents_2.GridEvents.ShowBlockSwapAnimationEvent, payload);
                }
                else {
                    this.deselectAll();
                }
            }
        }
        deselectAll() {
            let resetSelectedCoord = this._currentlySelectedCoord;
            let resetSwapCoord = this._swapCandidateCoord;
            this.resetSelectedAndSwapCoords();
            if (resetSelectedCoord != undefined) {
                this.dispatchEvent(GridEvents_2.GridEvents.ShowBlockUnselectedEvent, resetSelectedCoord);
            }
            if (resetSwapCoord != undefined) {
                this.dispatchEvent(GridEvents_2.GridEvents.ShowBlockUnselectedEvent, resetSwapCoord);
            }
        }
        blockIsLegalSwapCandidate(swapCandidateCoord) {
            if (swapCandidateCoord.x == this._currentlySelectedCoord.x) {
                if (swapCandidateCoord.y == this._currentlySelectedCoord.y + 1 || swapCandidateCoord.y == this._currentlySelectedCoord.y - 1) {
                    return true;
                }
            }
            if (swapCandidateCoord.y == this._currentlySelectedCoord.y) {
                if (swapCandidateCoord.x == this._currentlySelectedCoord.x + 1 || swapCandidateCoord.x == this._currentlySelectedCoord.x - 1) {
                    return true;
                }
            }
            return false;
        }
        onGridInitialisedEvent() {
            this.dispatchEvent(InputEvents_1.InputEvents.EnableInputsEvent);
        }
        addBlockSwapEventListeners() {
            this.addEventListener(GridEvents_2.GridEvents.SelectedBlockSwapAnimationCompleteEvent, this.onSelectedBlockSwapComplete.bind(this));
            this.addEventListener(GridEvents_2.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this.onSwapCandidateBlockSwapComplete.bind(this));
        }
        removeBlockSwapEventListeners() {
            this.removeEventListener(GridEvents_2.GridEvents.SelectedBlockSwapAnimationCompleteEvent);
            this.removeEventListener(GridEvents_2.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent);
        }
        onSelectedBlockSwapComplete() {
            this._selectedBlockSwapAnimationComplete = true;
            if (this._swapCandidateBlockSwapAnimationComplete && this._selectedBlockSwapAnimationComplete) {
                this.handleBothBlockSwapAnimationsComplete();
            }
        }
        onSwapCandidateBlockSwapComplete() {
            this._swapCandidateBlockSwapAnimationComplete = true;
            if (this._selectedBlockSwapAnimationComplete && this._swapCandidateBlockSwapAnimationComplete) {
                this.handleBothBlockSwapAnimationsComplete();
            }
        }
        handleBothBlockSwapAnimationsComplete() {
            this.resetAnimationFlags();
            this.removeBlockSwapEventListeners();
            this.dispatchEvent(GridEvents_2.GridEvents.BlockSwapAnimationCompleteEvent);
            this.addGridEvaluationEventListeners();
            this.dispatchEvent(GridEvents_2.GridEvents.EvaluateGridEvent);
        }
        get currentlySelectedCoord() {
            return this._currentlySelectedCoord;
        }
        get swapCandidateCoord() {
            return this._swapCandidateCoord;
        }
        resetSelectedAndSwapCoords() {
            this._swapCandidateCoord = undefined;
            this._currentlySelectedCoord = undefined;
        }
        resetAnimationFlags() {
            this._selectedBlockSwapAnimationComplete = false;
            this._swapCandidateBlockSwapAnimationComplete = false;
        }
        onGridEvaluationSuccessEvent(message) {
            this.resetSelectedAndSwapCoords();
            this.removeGridEvaluationEventListeners();
            this.addEventListener(GridEvents_2.GridEvents.BreakAndCascadeBlocksCompleteEvent, this.onBreakAndCascaseBlocksCompleteEvent.bind(this));
            this.dispatchEvent(GridEvents_2.GridEvents.BreakAndCascadeBlocksEvent, message);
        }
        onBreakAndCascaseBlocksCompleteEvent(message) {
            console.log("GridModel.onBreakAndCascaseBlocksCompleteEvent()");
            this.addGridEvaluationEventListeners();
            this.dispatchEvent(GridEvents_2.GridEvents.EvaluateGridEvent);
        }
        onGridEvaluationNegativeEvent(message) {
            this.removeGridEvaluationEventListeners();
            let negativeEvaluationWasResultOfASwap = this._currentlySelectedCoord != undefined && this._swapCandidateCoord != undefined;
            let selectedCoord = this._currentlySelectedCoord;
            let swapCandidateCoord = this._swapCandidateCoord;
            this.resetSelectedAndSwapCoords;
            if (negativeEvaluationWasResultOfASwap) {
                //bogus way of checking that this evaluation is a result of a swap.
                this.dispatchEvent(GridEvents_2.GridEvents.ShowBlockSwapAnimationEvent, new SwapVO_2.SwapVO(selectedCoord, swapCandidateCoord));
                this.deselectAll();
                this.dispatchEvent(InputEvents_1.InputEvents.EnableInputsEvent);
            }
            else {
                this.resetSelectedAndSwapCoords;
                this.addEventListener(GridEvents_2.GridEvents.RefillGridCompleteEvent, this.onRefillGridCompleteEvent.bind(this));
                this.dispatchEvent(GridEvents_2.GridEvents.RefillGridEvent);
            }
        }
        onRefillGridCompleteEvent() {
            this.removeEventListener(GridEvents_2.GridEvents.RefillGridCompleteEvent);
            this.addRefillEvaluationEventListeners();
            this.dispatchEvent(GridEvents_2.GridEvents.EvaluateGridEvent);
        }
        addRefillEvaluationEventListeners() {
            this.addEventListener(GridEvents_2.GridEvents.GridEvaluationPositiveEvent, this.onGridEvaluationSuccessEvent.bind(this));
            this.addEventListener(GridEvents_2.GridEvents.GridEvaluationNegativeEvent, this.onRefillEvaluationNegativeEvent.bind(this));
        }
        onRefillEvaluationNegativeEvent() {
            this.dispatchEvent(InputEvents_1.InputEvents.EnableInputsEvent);
        }
        addGridEvaluationEventListeners() {
            this.addEventListener(GridEvents_2.GridEvents.GridEvaluationPositiveEvent, this.onGridEvaluationSuccessEvent.bind(this));
            this.addEventListener(GridEvents_2.GridEvents.GridEvaluationNegativeEvent, this.onGridEvaluationNegativeEvent.bind(this));
        }
        removeGridEvaluationEventListeners() {
            this.removeEventListener(GridEvents_2.GridEvents.GridEvaluationPositiveEvent);
            this.removeEventListener(GridEvents_2.GridEvents.GridEvaluationNegativeEvent);
        }
    }
    exports.GridModel = GridModel;
});
define("Input/InputController", ["require", "exports", "System/Events/EventHandler", "Block/BlockEvents", "Input/InputEvents"], function (require, exports, EventHandler_4, BlockEvents_2, InputEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InputController extends EventHandler_4.EventHandler {
        constructor(injectedEventHub, injectedGridModel) {
            super(injectedEventHub);
            this._gridModel = injectedGridModel;
            this.addEventListener(InputEvents_2.InputEvents.EnableInputsEvent, this.onEnableInputsEvent.bind(this));
            this.addEventListener(InputEvents_2.InputEvents.DisableInputsEvent, this.onDisableInputsEvent.bind(this));
        }
        onEnableInputsEvent() {
            this.addEventListener(BlockEvents_2.BlockEvents.BlockTouchedEvent, this.onBlockTouched.bind(this));
        }
        onDisableInputsEvent() {
            this.removeEventListener(BlockEvents_2.BlockEvents.BlockTouchedEvent);
        }
        onBlockTouched(message) {
            this._gridModel.selectBlock(message);
        }
        printMessageIssue(message) {
            console.log(`Something went wrong with message ${message}`);
        }
    }
    exports.InputController = InputController;
});
define("Grid/GridEvaluator", ["require", "exports", "Grid/VOs/BreakVO", "typescript-collections", "System/Events/EventHandler", "Grid/GridEvents"], function (require, exports, BreakVO_1, typescript_collections_3, EventHandler_5, GridEvents_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridEvaluator extends EventHandler_5.EventHandler {
        constructor(injectedEventHub, injectedNodeMesh) {
            super(injectedEventHub);
            this._gridNodes = injectedNodeMesh;
            this.addEventListener(GridEvents_3.GridEvents.EvaluateGridEvent, this.onEvaluateGridEvent.bind(this));
        }
        onEvaluateGridEvent() {
            this.evaluateGrid();
        }
        evaluateGrid() {
            console.log("GridEvaluator.evaluateGrid()");
            let breakVOs = [];
            this._gridNodes.nodes.forEach((point, node) => {
                this.evaluateNode(node, breakVOs);
            });
            if (breakVOs.length > 0) {
                this.dispatchEvent(GridEvents_3.GridEvents.GridEvaluationPositiveEvent, breakVOs);
            }
            else {
                this.dispatchEvent(GridEvents_3.GridEvents.GridEvaluationNegativeEvent);
            }
        }
        evaluateNode(gridNode, breakVOs) {
            if (this.nodeExistsInExistingBreak(gridNode, breakVOs) || !gridNode.isOccupied) {
                return;
            }
            let colour = gridNode.getCurrentBlock().blockColour;
            let totalVerticalBreak = this.searchAboveNode(gridNode.nodeAbove, [], colour).concat(gridNode).concat(this.searchBelowNode(gridNode.nodeBelow, [], colour));
            let totalHorizontalBreak = this.searchLeftNode(gridNode.nodeLeft, [], colour).concat(gridNode).concat(this.searchRightNode(gridNode.nodeRight, [], colour));
            let set = new typescript_collections_3.Set();
            if (totalHorizontalBreak.length >= 3) {
                totalHorizontalBreak.forEach(element => {
                    set.add(element.gridCoordinate);
                });
            }
            if (totalVerticalBreak.length >= 3) {
                totalVerticalBreak.forEach(element => {
                    set.add(element.gridCoordinate);
                });
            }
            if (set.size() > 0) {
                this.addToBreakVOs(new BreakVO_1.BreakVO(set), breakVOs);
            }
        }
        nodeExistsInExistingBreak(gridNode, breakVOs) {
            for (let i = 0; i < breakVOs.length; i++) {
                if (breakVOs[i].coords.contains(gridNode.gridCoordinate)) {
                    return true;
                }
            }
            return false;
        }
        addToBreakVOs(voToAdd, breakVos) {
            for (let i = 0; i < breakVos.length; i++) {
                if (this.breakVOsIntersect(voToAdd, breakVos[i])) {
                    //Before we add it to the list of breakVOs
                    //check that we can't merge it with another instead. 
                    //To avoid duplicates in the payload which we send.
                    breakVos[i].coords.union(voToAdd.coords);
                    return;
                }
            }
            //if not we just push this into the collection of vo's
            breakVos.push(voToAdd);
        }
        breakVOsIntersect(first, second) {
            for (let i = 0; i < first.coords.toArray().length; i++) {
                if (second.coords.contains(first.coords.toArray()[i])) {
                    return true;
                }
            }
            return false;
        }
        searchAboveNode(matchGridNode, matchedSoFar, colour) {
            if (matchGridNode == undefined || !matchGridNode.isOccupied) {
                //if this node is unoccupied return what we've got so far.
                return matchedSoFar;
            }
            if (matchGridNode.getCurrentBlock().blockColour == colour) {
                //if this node matches so far, add it.
                matchedSoFar.push(matchGridNode);
            }
            else {
                //if this node doesn't match, this chain is over.
                return matchedSoFar;
            }
            if (matchGridNode.nodeAbove == undefined) {
                //if we hit the boundary, return what we've got so far.
                return matchedSoFar;
            }
            else {
                //if not keep going up
                return this.searchAboveNode(matchGridNode.nodeAbove, matchedSoFar, colour);
            }
        }
        searchBelowNode(matchGridNode, matchedSoFar, colour) {
            try {
                if (matchGridNode == undefined || !matchGridNode.isOccupied) {
                    //if this node is unoccupied return what we've got so far.
                    return matchedSoFar;
                }
                if (matchGridNode.getCurrentBlock().blockColour == colour) {
                    //if this node matches so far, add it.
                    matchedSoFar.push(matchGridNode);
                }
                else {
                    //if this node doesn't match, this chain is over.
                    return matchedSoFar;
                }
                if (matchGridNode.nodeBelow == undefined) {
                    //if we hit the boundary, return what we've got so far.
                    return matchedSoFar;
                }
                else {
                    //if not keep going down
                    return this.searchBelowNode(matchGridNode.nodeBelow, matchedSoFar, colour);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        searchLeftNode(matchGridNode, matchedSoFar, colour) {
            if (matchGridNode == undefined || !matchGridNode.isOccupied) {
                //if this node is unoccupied return what we've got so far.
                return matchedSoFar;
            }
            if (matchGridNode.getCurrentBlock().blockColour == colour) {
                //if this node matches so far, add it.
                matchedSoFar.push(matchGridNode);
            }
            else {
                //if this node doesn't match, this chain is over.
                return matchedSoFar;
            }
            if (matchGridNode.nodeLeft == undefined) {
                //if we hit the boundary, return what we've got so far.
                return matchedSoFar;
            }
            else {
                //if not keep going left
                return this.searchLeftNode(matchGridNode.nodeLeft, matchedSoFar, colour);
            }
        }
        searchRightNode(matchGridNode, matchedSoFar, colour) {
            if (matchGridNode == undefined || !matchGridNode.isOccupied) {
                //if this node is unoccupied return what we've got so far.
                return matchedSoFar;
            }
            if (matchGridNode.getCurrentBlock().blockColour == colour) {
                //if this node matches so far, add it.
                matchedSoFar.push(matchGridNode);
            }
            else {
                //if this node doesn't match, this chain is over.
                return matchedSoFar;
            }
            if (matchGridNode.nodeRight == undefined) {
                //if we hit the boundary, return what we've got so far.
                return matchedSoFar;
            }
            else {
                //if not keep going right
                return this.searchRightNode(matchGridNode.nodeRight, matchedSoFar, colour);
            }
        }
    }
    exports.GridEvaluator = GridEvaluator;
});
define("System/ISystemModel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("System/SystemModel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SystemModel {
        set gridModel(gridModel) {
            this._gridModel = gridModel;
        }
        get gridModel() {
            return this._gridModel;
        }
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
        set inputController(inputController) {
            this._inputController = inputController;
        }
        get inputController() {
            return this._inputController;
        }
        set gridEvaluator(gridEvaluator) {
            this._gridEvaluator = gridEvaluator;
        }
        get gridEvaluator() {
            return this._gridEvaluator;
        }
        set gridController(gridController) {
            this._gridController = gridController;
        }
        get gridController() {
            return this._gridController;
        }
    }
    exports.SystemModel = SystemModel;
});
define("System/Startup", ["require", "exports", "Block/BlockFactory", "System/SystemModel", "Grid/GridController", "System/Events/EventHub", "Grid/GridEvents", "Input/InputController", "Grid/GridModel", "Grid/GridEvaluator", "Grid/NodeMeshFactory"], function (require, exports, BlockFactory_1, SystemModel_1, GridController_1, EventHub_1, GridEvents_4, InputController_1, GridModel_1, GridEvaluator_1, NodeMeshFactory_1) {
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
            this.systemModel.eventHub.dispatchEvent(GridEvents_4.GridEvents.InitialiseGridEvent);
        }
        bootstrapGame() {
            //Order is starting to become a concern here. Maaay need to rethink this in terms of categories.
            this.bootstrapEventHub();
            this.bootstrapModels();
            this.bootstrapInput();
            this.bootstrapBlockFactory();
            this.bootstrapGrid();
        }
        bootstrapEventHub() {
            let eventHub = new EventHub_1.EventHub();
            this._systemModel.eventHub = eventHub;
        }
        bootstrapBlockFactory() {
            let blockLayerGroup = this._game.add.group();
            let blockFactory = new BlockFactory_1.BlockFactory(this._game, blockLayerGroup, this._systemModel.eventHub);
            this._systemModel.blockFactory = blockFactory;
        }
        bootstrapInput() {
            let inputController = new InputController_1.InputController(this._systemModel.eventHub, this._systemModel.gridModel);
            this._systemModel.inputController = inputController;
        }
        bootstrapModels() {
            this._systemModel.gridModel = new GridModel_1.GridModel(this._systemModel.eventHub);
        }
        bootstrapGrid() {
            let nodeMesh = new NodeMeshFactory_1.NodeMeshFactory().createNodeMesh(new Phaser.Point(9, 9));
            let gridEvaluator = new GridEvaluator_1.GridEvaluator(this._systemModel.eventHub, nodeMesh);
            this._systemModel.gridEvaluator = gridEvaluator;
            let gridController = new GridController_1.GridController(9, 9, this._systemModel.blockFactory, this._systemModel.eventHub, nodeMesh);
            this._systemModel.gridController = gridController;
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