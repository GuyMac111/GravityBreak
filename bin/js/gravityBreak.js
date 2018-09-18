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
        }
        initialise(startingCoordinates, colour) {
            this._diamondSprite = this.layerGroup.create(startingCoordinates.x, startingCoordinates.y, 'diamonds', colour);
            this._diamondSprite.inputEnabled = true;
            this._diamondSprite.events.onInputDown.add(this.onBlockTouched, this);
        }
        moveToPosition(destinationCoordinates, speed, onComplete) {
            let tween = this.game.add.tween(this._diamondSprite).to({
                x: destinationCoordinates.x,
                y: destinationCoordinates.y
            }, speed, Phaser.Easing.Linear.None);
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
            tween.onComplete.add(function () {
                console.log("Block unselection complete");
            });
            tween.start();
        }
        onBlockTouched() {
            if (this.onTouch != undefined) {
                this.onTouch();
            }
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
            this.FALL_DURATION = 10;
            this.SWAP_DURATION = 100;
            this._blockView = injectedView;
            this._blockColour = colour;
            this._blockView.initialise(this.translateGridCoordsToWorld(startingGridPosition), this._blockColour);
            this._blockView.onTouch = this.onViewTouched.bind(this);
        }
        cascadeBlockTo(gridDestination) {
            this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.FALL_DURATION, this.onBlockMoveComplete.bind(this));
        }
        swapBlockTo(gridDestination) {
            this._blockView.moveToPosition(this.translateGridCoordsToWorld(gridDestination), this.SWAP_DURATION, this.onBlockMoveComplete.bind(this));
        }
        onBlockMoveComplete() {
            console.log("BlockMediator.onBlockMoveComplete()::: Block completed movement");
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
        set currentNode(node) {
            this._currentNode = node;
        }
        get blockColour() {
            return this._blockColour;
        }
        translateGridCoordsToWorld(gridCoords) {
            return new Phaser.Point(gridCoords.x * 64, gridCoords.y * 64);
        }
        onViewTouched() {
            if (this._currentNode != undefined) {
                this.dispatchEvent(BlockEvents_1.BlockEvents.BlockTouchedEvent, this._currentNode.gridCoordinate);
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
            this._numTimesAboveSet = 0;
            this._gridCoordinate = new Phaser.Point(gridCoordinate.x, gridCoordinate.y);
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
            if (this._numTimesAboveSet > 0) {
                console.log(`HERE!!!!! ${this._gridCoordinate}`);
            }
            this._numTimesAboveSet++;
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
                ///IT WAS HEREE::::::: LOOOL. 
                nodeToAssociate.nodeRight = this._nodeMesh.getValue(new Phaser.Point(nodeToAssociate.gridCoordinate.x + 1, nodeToAssociate.gridCoordinate.y));
                console.log(`NodeMeshFactory::: The node to the right of node ${nodeToAssociate.gridCoordinate} is set to ${nodeToAssociate.nodeRight.gridCoordinate}`);
            }
            else {
                console.log(`NodeMeshFactory::: The node ${nodeToAssociate.gridCoordinate} is flush to the right. Creating spawn node left.`);
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
    GridEvents.ShowBlockSelectedEvent = "GridEvent.ShowBlockSelected";
    GridEvents.ShowBlockUnselectedEvent = "GridEvent.ShowBlockUnselected";
    GridEvents.ShowBlockSwapAnimationEvent = "GridEvent.ShowBlockSwapAnimation";
    GridEvents.SelectedBlockSwapAnimationCompleteEvent = "GridEvent.SelectedBlockSwapAnimationComplete";
    GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent = "GridEvent.SwapCandidateBlockSwapAnimationComplete";
    GridEvents.BlockSwapAnimationCompleteEvent = "GridEvent.BlockSwapAnimationComplete";
    GridEvents.EvaluateGridEvent = "GridEvent.EvaluateGrid";
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
define("Grid/GridModel", ["require", "exports", "System/Events/EventHandler", "Grid/GridEvents", "Grid/VOs/SwapVO"], function (require, exports, EventHandler_2, GridEvents_1, SwapVO_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridModel extends EventHandler_2.EventHandler {
        constructor(injectedEventHub) {
            super(injectedEventHub);
            this._selectedBlockSwapAnimationComplete = false;
            this._swapCandidateBlockSwapAnimationComplete = false;
            this._gridEvaluationInProgress = false;
        }
        get hasCurrentlySelectedBlock() {
            return this._currentlySelectedCoord != undefined;
        }
        set currentlySelectedCoord(coord) {
            if (this._currentlySelectedCoord == undefined) {
                this._currentlySelectedCoord = coord;
                this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockSelectedEvent, this._currentlySelectedCoord);
            }
            else {
                console.log("GridModel.set currentlySelectedCoord::: Something went wrong. Why are we trying to set the currSelectedCoord when there's already one?");
            }
        }
        //Too much responsibility in here
        set swapCandidateCoord(coord) {
            if (this._swapCandidateCoord == undefined && coord != this._currentlySelectedCoord && this.blockIsLegalSwapCandidate(coord)) {
                this._swapCandidateCoord = coord;
                let payload = new SwapVO_1.SwapVO(this._currentlySelectedCoord, this._swapCandidateCoord);
                this.addBlockSwapEventListeners();
                this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockUnselectedEvent, this._currentlySelectedCoord);
                this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockSwapAnimationEvent, payload);
            }
            else {
                console.log("GridModel.set swapCandidateCoord::: Something went wrong. Why are we trying to set the swapCandidateCoord when there's already one?");
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
        addBlockSwapEventListeners() {
            this.addEventListener(GridEvents_1.GridEvents.SelectedBlockSwapAnimationCompleteEvent, this.onSelectedBlockSwapComplete.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this.onSwapCandidateBlockSwapComplete.bind(this));
        }
        removeBlockSwapEventListeners() {
            this.removeEventListener(GridEvents_1.GridEvents.SelectedBlockSwapAnimationCompleteEvent);
            this.removeEventListener(GridEvents_1.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent);
        }
        onSelectedBlockSwapComplete(message) {
            this._selectedBlockSwapAnimationComplete = true;
            if (this._swapCandidateBlockSwapAnimationComplete && this._selectedBlockSwapAnimationComplete) {
                this.handleBothBlockSwapAnimationsComplete(message);
            }
        }
        onSwapCandidateBlockSwapComplete(message) {
            this._swapCandidateBlockSwapAnimationComplete = true;
            if (this._selectedBlockSwapAnimationComplete && this._swapCandidateBlockSwapAnimationComplete) {
                this.handleBothBlockSwapAnimationsComplete(message);
            }
        }
        handleBothBlockSwapAnimationsComplete(nodeMesh) {
            this.resetAnimationFlags();
            this.removeBlockSwapEventListeners();
            this._gridEvaluationInProgress = true;
            this.dispatchEvent(GridEvents_1.GridEvents.BlockSwapAnimationCompleteEvent);
            this.dispatchEvent(GridEvents_1.GridEvents.EvaluateGridEvent, nodeMesh);
        }
        get currentlySelectedCoord() {
            return this._currentlySelectedCoord;
        }
        get swapCandidateCoord() {
            return this._swapCandidateCoord;
        }
        resetAnimationFlags() {
            this._selectedBlockSwapAnimationComplete = false;
            this._swapCandidateBlockSwapAnimationComplete = false;
        }
        resetSelectedAndSwapCoords() {
            this._swapCandidateCoord = undefined;
            this._currentlySelectedCoord = undefined;
        }
    }
    exports.GridModel = GridModel;
});
define("Grid/GridController", ["require", "exports", "Grid/NodeMeshFactory", "Cascade/CascadeStrategyProvider", "System/Events/EventHandler", "Grid/GridEvents", "Grid/VOs/SwapVO"], function (require, exports, NodeMeshFactory_1, CascadeStrategyProvider_1, EventHandler_3, GridEvents_2, SwapVO_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridController extends EventHandler_3.EventHandler {
        constructor(nodesHigh, nodesWide, injectedBlockFactory, injectedEventHub) {
            super(injectedEventHub);
            this.addEventListener(GridEvents_2.GridEvents.InitialiseGridEvent, this.onInitialiseEvent.bind(this));
            this.addEventListener(GridEvents_2.GridEvents.ShowBlockSelectedEvent, this.onShowBlockSelectedEvent.bind(this));
            this.addEventListener(GridEvents_2.GridEvents.ShowBlockUnselectedEvent, this.onShowBlockUnselectedEvent.bind(this));
            this.addEventListener(GridEvents_2.GridEvents.ShowBlockSwapAnimationEvent, this.onShowBlockSwapAnimationEvent.bind(this));
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
            let cascadeStrategy = this._cascadeStrategyProvider.cascadeStrategy;
            //TODO:: hmmmm....Maybe remove this check and just check here for undefined?
            if (cascadeStrategy.shouldSpawnBlock) {
                let spawnData = cascadeStrategy.nextSpawn;
                let block = this._blockFactory.createBlockAtPosition(spawnData.spawnNode.gridCoordinate);
                block.blockMoveComplete = this.onBlockSpawnCompleteCallback.bind(this);
                //Set the node's reference here so it can be omitted from future checks
                spawnData.destination.currentBlock = block;
                //Set the blockMediators ref to the destination node so that it can access its own location for input events
                block.currentNode = spawnData.destination;
                console.log(`GridController.spawnBlocks()::: Block move started (initial position ${spawnData.spawnNode.gridCoordinate.x},${spawnData.spawnNode.gridCoordinate.y})`);
                block.cascadeBlockTo(spawnData.destination.gridCoordinate);
            }
            else {
                //Our grid should be full at this point
                console.log("GridController.spawnBlocks()::: Our grid is fully cascaded.....supposedly.");
            }
        }
        onBlockSpawnCompleteCallback(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            this.spawnBlocks();
        }
        onShowBlockSelectedEvent(message) {
            if (message instanceof Phaser.Point) {
                console.log(`GridController.onShowBlockSelectedEvent()::: Selecting block ${message}`);
                this._gridNodes.nodes.getValue(message).currentBlock.showBlockSelected();
            }
        }
        onShowBlockUnselectedEvent(message) {
            if (message instanceof Phaser.Point) {
                console.log(`GridController.onShowBlockUnselectedEvent()::: Unselecting block ${message}`);
                this._gridNodes.nodes.getValue(message).currentBlock.showBlockUnselected();
            }
        }
        onShowBlockSwapAnimationEvent(message) {
            if (message instanceof SwapVO_2.SwapVO) {
                let swapVO = message;
                this.swapBlocks(swapVO.firstBlockCoord, swapVO.secondBlockCoord);
            }
        }
        swapBlocks(firstGridCoord, secondGridCoord) {
            let firstNode = this._gridNodes.nodes.getValue(firstGridCoord);
            let secondNode = this._gridNodes.nodes.getValue(secondGridCoord);
            let holdThisForASecond = firstNode.currentBlock;
            firstNode.currentBlock = secondNode.currentBlock;
            secondNode.currentBlock = holdThisForASecond;
            firstNode.currentBlock.currentNode = firstNode;
            secondNode.currentBlock.currentNode = secondNode;
            //As the nodes are now already holding their swapped values, we send the inverse and swap instruction events.
            firstNode.currentBlock.blockMoveComplete = this.onSwapCandidateBlockMoveComplete.bind(this);
            secondNode.currentBlock.blockMoveComplete = this.onSelectedBlockMoveComplete.bind(this);
            firstNode.currentBlock.swapBlockTo(firstGridCoord);
            secondNode.currentBlock.swapBlockTo(secondGridCoord);
        }
        onSelectedBlockMoveComplete(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
            this.dispatchEvent(GridEvents_2.GridEvents.SelectedBlockSwapAnimationCompleteEvent, this._gridNodes);
        }
        onSwapCandidateBlockMoveComplete(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
            this.dispatchEvent(GridEvents_2.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this._gridNodes);
        }
    }
    exports.GridController = GridController;
});
define("Input/InputController", ["require", "exports", "System/Events/EventHandler", "Block/BlockEvents"], function (require, exports, EventHandler_4, BlockEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InputController extends EventHandler_4.EventHandler {
        constructor(injectedEventHub, injectedGridModel) {
            super(injectedEventHub);
            this._gridModel = injectedGridModel;
            this.addEventListener(BlockEvents_2.BlockEvents.BlockTouchedEvent, this.onBlockTouched.bind(this));
        }
        onBlockTouched(message) {
            if (!(message instanceof Phaser.Point)) {
                this.printMessageIssue(message);
            }
            else {
                let gridLocationOfTouch = message;
                if (!this._gridModel.hasCurrentlySelectedBlock) {
                    this._gridModel.currentlySelectedCoord = gridLocationOfTouch;
                }
                else if (this._gridModel.swapCandidateCoord == undefined) {
                    this._gridModel.swapCandidateCoord = gridLocationOfTouch;
                }
            }
        }
        printMessageIssue(message) {
            console.log(`Something went wrong with message ${message}`);
        }
    }
    exports.InputController = InputController;
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
define("Grid/GridEvaluator", ["require", "exports", "Grid/NodeMesh", "Grid/VOs/BreakVO", "typescript-collections", "System/Events/EventHandler", "Grid/GridEvents"], function (require, exports, NodeMesh_2, BreakVO_1, typescript_collections_3, EventHandler_5, GridEvents_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridEvaluator extends EventHandler_5.EventHandler {
        constructor(injectedEventHub) {
            super(injectedEventHub);
            this.addEventListener(GridEvents_3.GridEvents.EvaluateGridEvent, this.onEvaluateGridEvent.bind(this));
        }
        onEvaluateGridEvent(message) {
            if (message instanceof NodeMesh_2.NodeMesh) {
                this.evaluateGrid(message);
            }
        }
        evaluateGrid(nodeMesh) {
            let breakVOs = [];
            let nodeMeshToEvaluate = nodeMesh;
            nodeMeshToEvaluate.nodes.forEach((point, node) => {
                this.evaluateNode(node, breakVOs);
            });
            if (breakVOs.length > 0) {
                console.log("GridEvaluator::: WE GOT BREAKS");
            }
            else {
                console.log("GridEvaluator::: NO BREAKS");
            }
        }
        evaluateNode(gridNode, breakVOs) {
            if (this.nodeExistsInExistingBreak(gridNode, breakVOs) || gridNode.currentBlock == undefined) {
                return;
            }
            let colour = gridNode.currentBlock.blockColour;
            let totalVerticalBreak = this.searchAboveNode(gridNode.nodeAbove, [], colour).concat(this.searchBelowNode(gridNode.nodeBelow, [], colour)).concat(gridNode);
            let totalHorizontalBreak = this.searchLeftNode(gridNode.nodeLeft, [], colour).concat(this.searchRightNode(gridNode.nodeRight, [], colour)).concat(gridNode);
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
            if (matchGridNode.currentBlock.blockColour == colour) {
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
                if (matchGridNode.currentBlock.blockColour == colour) {
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
            if (matchGridNode.currentBlock.blockColour == colour) {
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
            if (matchGridNode.currentBlock.blockColour == colour) {
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
define("System/Startup", ["require", "exports", "Block/BlockFactory", "System/SystemModel", "Grid/GridController", "System/Events/EventHub", "Grid/GridEvents", "Input/InputController", "Grid/GridModel", "Grid/GridEvaluator"], function (require, exports, BlockFactory_1, SystemModel_1, GridController_1, EventHub_1, GridEvents_4, InputController_1, GridModel_1, GridEvaluator_1) {
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
            let gridEvaluator = new GridEvaluator_1.GridEvaluator(this._systemModel.eventHub);
            this._systemModel.gridEvaluator = gridEvaluator;
            let gridController = new GridController_1.GridController(9, 9, this._systemModel.blockFactory, this._systemModel.eventHub);
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