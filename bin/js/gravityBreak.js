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
define("System/Assets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Assets {
    }
    Assets.Config = "config";
    Assets.SpriteDiamonds = "diamonds";
    Assets.SpritePlanet = "planet";
    Assets.SFXBreak = "break";
    Assets.SFXCascade = "cascade";
    Assets.SFXBgm = "bgm";
    exports.Assets = Assets;
});
define("Gravity/GravityState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GravityState;
    (function (GravityState) {
        GravityState[GravityState["Up"] = 0] = "Up";
        GravityState[GravityState["Down"] = 1] = "Down";
        GravityState[GravityState["Left"] = 2] = "Left";
        GravityState[GravityState["Right"] = 3] = "Right";
    })(GravityState = exports.GravityState || (exports.GravityState = {}));
});
define("Block/BlockDestroyAnimation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlockDestroyAnimation;
    (function (BlockDestroyAnimation) {
        BlockDestroyAnimation[BlockDestroyAnimation["Warp"] = 0] = "Warp";
        BlockDestroyAnimation[BlockDestroyAnimation["Shrink"] = 1] = "Shrink";
        BlockDestroyAnimation[BlockDestroyAnimation["Fade"] = 2] = "Fade";
    })(BlockDestroyAnimation = exports.BlockDestroyAnimation || (exports.BlockDestroyAnimation = {}));
});
define("System/Config/GameConfigModel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameConfigModel {
        /**
         * Getter blockInitialSpawnFallDuration
         * @return {number}
         */
        get blockInitialSpawnFallDuration() {
            return this._blockInitialSpawnFallDuration;
        }
        /**
         * Setter blockInitialSpawnFallDuration
         * @param {number} value
         */
        set blockInitialSpawnFallDuration(value) {
            this._blockInitialSpawnFallDuration = value;
        }
        /**
         * Getter blockRepawnFallDuration
         * @return {number}
         */
        get blockRepawnFallDuration() {
            return this._blockRepawnFallDuration;
        }
        /**
         * Setter blockRepawnFallDuration
         * @param {number} value
         */
        set blockRepawnFallDuration(value) {
            this._blockRepawnFallDuration = value;
        }
        /**
         * Getter blockSwapDuration
         * @return {number}
         */
        get blockSwapDuration() {
            return this._blockSwapDuration;
        }
        /**
         * Setter blockSwapDuration
         * @param {number} value
         */
        set blockSwapDuration(value) {
            this._blockSwapDuration = value;
        }
        /**
         * Getter blockFallDuration
         * @return {number}
         */
        get blockFallDuration() {
            return this._blockFallDuration;
        }
        /**
         * Setter blockFallDuration
         * @param {number} value
         */
        set blockFallDuration(value) {
            this._blockFallDuration = value;
        }
        /**
         * Getter blockSelectionSpeed
         * @return {number}
         */
        get blockSelectionDuration() {
            return this._blockSelectionDuration;
        }
        /**
         * Setter blockSelectionSpeed
         * @param {number} value
         */
        set blockSelectionDuration(value) {
            this._blockSelectionDuration = value;
        }
        /**
         * Getter gridPosition
         * @return {Phaser.Point}
         */
        get gridPosition() {
            return this._gridPosition;
        }
        /**
         * Setter gridPosition
         * @param {Phaser.Point} value
         */
        set gridPosition(value) {
            this._gridPosition = value;
        }
        /**
         * Getter gridSize
         * @return {Phaser.Point}
         */
        get gridSize() {
            return this._gridSize;
        }
        /**
         * Setter gridSize
         * @param {Phaser.Point} value
         */
        set gridSize(value) {
            this._gridSize = value;
        }
        /**
         * Getter maskGridBounds
         * @return {boolean}
         */
        get maskGridBounds() {
            return this._maskGridBounds;
        }
        /**
         * Setter maskGridBounds
         * @param {boolean} value
         */
        /**
         * Getter blockPadding
         * @return {number}
         */
        get blockPadding() {
            return this._blockPadding;
        }
        /**
         * Setter blockPadding
         * @param {number} value
         */
        set blockPadding(value) {
            this._blockPadding = value;
        }
        /**
         * Getter blockSize
         * @return {number}
         */
        get blockSize() {
            return this._blockSize;
        }
        /**
         * Setter blockSize
         * @param {Phaser.Point} value
         */
        set blockSize(value) {
            this._blockSize = value;
        }
        set maskGridBounds(value) {
            this._maskGridBounds = value;
        }
        /**
         * Getter $cascadeDirection
         * @return {GravityState}
         */
        get cascadeDirection() {
            return this._cascadeDirection;
        }
        /**
         * Setter $cascadeDirection
         * @param {GravityState} value
         */
        set cascadeDirection(value) {
            this._cascadeDirection = value;
        }
        /**
         * Getter $blockDestroyAnimation
         * @return {BlockDestroyAnimation}
         */
        get blockDestroyAnimation() {
            return this._blockDestroyAnimation;
        }
        /**
         * Setter $blockDestroyAnimation
         * @param {BlockDestroyAnimation} value
         */
        set blockDestroyAnimation(value) {
            this._blockDestroyAnimation = value;
        }
        /**
         * Getter time
         * @return {number}
         */
        get time() {
            return this._time;
        }
        /**
         * Setter time
         * @param {number} value
         */
        set time(value) {
            this._time = value;
        }
        /**
         * Getter targetScore
         * @return {number}
         */
        get targetScore() {
            return this._targetScore;
        }
        /**
         * Setter targetScore
         * @param {number} value
         */
        set targetScore(value) {
            this._targetScore = value;
        }
    }
    exports.GameConfigModel = GameConfigModel;
});
define("Block/BlockView", ["require", "exports", "System/View", "System/Assets"], function (require, exports, View_1, Assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockView extends View_1.View {
        constructor(injectedGame, layerGroup, gameConfig) {
            super(injectedGame, layerGroup);
            this._gameConfig = gameConfig;
        }
        initialise(startingGridCoordinates, colour) {
            let startingCoords = this.translateGridCoordsToWorld(startingGridCoordinates);
            this._diamondSprite = this.layerGroup.create(startingCoords.x, startingCoords.y, Assets_1.Assets.SpriteDiamonds, colour);
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
            }, this._gameConfig.blockSelectionDuration, Phaser.Easing.Bounce.Out);
            tween.start();
        }
        showBlockUnselected() {
            let tween = this.game.add.tween(this._diamondSprite.scale).to({
                x: 1,
                y: 1
            }, this._gameConfig.blockSelectionDuration, Phaser.Easing.Bounce.Out);
            tween.start();
        }
        showBlockDestroyAnimation(delay, onStart, onComplete) {
            let horizTween = this.game.add.tween(this._diamondSprite.scale).to({ x: 1.25, y: 0.05 }, 300, Phaser.Easing.Elastic.Out, false, delay);
            let vertTween = this.game.add.tween(this._diamondSprite.scale).to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None, false, 50);
            vertTween.onComplete.add(onComplete);
            vertTween.onStart.add(onStart);
            horizTween.chain(vertTween);
            horizTween.start();
        }
        destroySpriteInstance() {
            this._diamondSprite.destroy();
        }
        get spriteCenterOffset() {
            return this._gameConfig.blockSize / 2;
        }
        onBlockTouched() {
            if (this.onTouch != undefined) {
                this.onTouch();
            }
        }
        translateGridCoordsToWorld(gridCoords) {
            return new Phaser.Point(gridCoords.x * (this._gameConfig.blockSize + this._gameConfig.blockPadding) + this.spriteCenterOffset, gridCoords.y * (this._gameConfig.blockSize + this._gameConfig.blockPadding) + this.spriteCenterOffset);
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
define("Sound/SoundEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SoundEvents {
    }
    SoundEvents.PlayBGMEvent = "PlayBGM";
    SoundEvents.PlayExplosionEvent = "PlayExplosion";
    SoundEvents.PlayCascadeEvent = "PlayCascade";
    exports.SoundEvents = SoundEvents;
});
define("Block/BlockMediator", ["require", "exports", "System/Mediator", "Block/BlockEvents", "Sound/SoundEvents"], function (require, exports, Mediator_1, BlockEvents_1, SoundEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockMediator extends Mediator_1.Mediator {
        constructor(startingGridPosition, colour, injectedView, injectedEventHub, gameConfig) {
            super(injectedEventHub);
            this.SPAWN_DURATION = 7;
            this.RESPAWN_DURATION = 50;
            this.SWAP_DURATION = 100;
            this.CASCADE_DURATION = 200;
            this._isLastBlockToCascade = false;
            this._blockView = injectedView;
            this._gameConfig = gameConfig;
            this._blockColour = colour;
            this._blockView.initialise(startingGridPosition, this._blockColour);
            this._blockView.onTouch = this.onViewTouched.bind(this);
        }
        spawnBlockTo(gridDestination) {
            this._blockView.moveToPosition(gridDestination, this._gameConfig.blockInitialSpawnFallDuration, this.onBlockMoveComplete.bind(this));
        }
        respawnBlockTo(gridDestination) {
            this.dispatchEvent(SoundEvents_1.SoundEvents.PlayCascadeEvent);
            this._blockView.moveToPosition(gridDestination, this._gameConfig.blockRepawnFallDuration, this.onBlockMoveComplete.bind(this));
        }
        swapBlockTo(gridDestination) {
            this._blockView.moveToPosition(gridDestination, this._gameConfig.blockSwapDuration, this.onBlockMoveComplete.bind(this));
        }
        cascadeBlockTo(gridDestination, isLastBlockToCascade) {
            this._isLastBlockToCascade = isLastBlockToCascade;
            this._cascadeDestination = gridDestination;
            this._blockView.moveToPosition(gridDestination, this._gameConfig.blockFallDuration, this.onCascadeMovementComplete.bind(this));
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
            this._blockView.showBlockDestroyAnimation(delay, this.playBreakSFX.bind(this), this.onBlockDestroyComplete.bind(this));
        }
        playBreakSFX() {
            this.dispatchEvent(SoundEvents_1.SoundEvents.PlayExplosionEvent);
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
define("Block/BlockFactory", ["require", "exports", "Block/BlockMediator", "Block/BlockView", "Block/BlockColour"], function (require, exports, BlockMediator_1, BlockView_1, BlockColour_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BlockFactory {
        //We're going to use this starting point to setup BlockMediators and Views.
        //with absolutely everything they need.
        //It's also going to substitute as a VERY hamfisted Dependency Injector for those classes.
        //But as it also needs an instance of game, it's also going to need to be "injected" with "game".
        constructor(game, blockLayerGroup, injectedEventHub, gameConfig) {
            this._game = game;
            this._blocksLayerGroup = blockLayerGroup;
            this._eventHub = injectedEventHub;
            this._gameConfig = gameConfig;
        }
        createBlockAtPosition(startingPosition) {
            let view = this.createBlockView();
            let mediator = new BlockMediator_1.BlockMediator(startingPosition, this.generateRandomColour(), view, this._eventHub, this._gameConfig);
            return mediator;
        }
        generateRandomColour() {
            //hacky solution for randomising between enum values. WILL fail on string enums.
            let numEnumValues = Object.keys(BlockColour_1.BlockColour).length / 2;
            let randomEnumInt = Math.floor(Math.random() * numEnumValues);
            return randomEnumInt;
        }
        createBlockView() {
            let blockView = new BlockView_1.BlockView(this._game, this._blocksLayerGroup, this._gameConfig);
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
define("Input/InputEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InputEvents {
    }
    InputEvents.EnableInputsEvent = "InputEvents.EnableInputs";
    InputEvents.DisableInputsEvent = "InputEvents.DisableInputs";
    InputEvents.RotateRightTouched = "InputEvents.RotateRightTouched";
    InputEvents.RotateLeftTouched = "InputEvents.RotateLeftTouched";
    exports.InputEvents = InputEvents;
});
define("System/Time/TimerEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TimerEvents {
    }
    TimerEvents.StartTimeEvent = "TimerEvents.StartTime";
    TimerEvents.TimeIntervalElapsedEvent = "TimerEvents.TimeIntervalElapsed";
    TimerEvents.TimeExpiredEvent = "TimerEvents.TimeExpired";
    exports.TimerEvents = TimerEvents;
});
define("Grid/GridStateController", ["require", "exports", "System/Events/EventHandler", "Grid/GridEvents", "Grid/VOs/SwapVO", "Input/InputEvents", "System/Time/TimerEvents", "Sound/SoundEvents"], function (require, exports, EventHandler_2, GridEvents_1, SwapVO_1, InputEvents_1, TimerEvents_1, SoundEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridStateController extends EventHandler_2.EventHandler {
        constructor(injectedEventHub) {
            super(injectedEventHub);
            this._selectedBlockSwapAnimationComplete = false;
            this._swapCandidateBlockSwapAnimationComplete = false;
            this.addEventListener(GridEvents_1.GridEvents.InitialiseGridCompleteEvent, this.onGridInitialisedEvent.bind(this));
            this.addEventListener(TimerEvents_1.TimerEvents.TimeExpiredEvent, this.onTimeExpiredEvent.bind(this));
        }
        get hasCurrentlySelectedBlock() {
            return this._currentlySelectedCoord != undefined;
        }
        selectBlock(coord) {
            if (this._currentlySelectedCoord == undefined) {
                this._currentlySelectedCoord = coord;
                this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockSelectedEvent, this._currentlySelectedCoord);
            }
            else if (coord == this._currentlySelectedCoord) {
                this.deselectAll();
            }
            else {
                if (this.blockIsLegalSwapCandidate(coord)) {
                    this._swapCandidateCoord = coord;
                    let payload = new SwapVO_1.SwapVO(this._currentlySelectedCoord, this._swapCandidateCoord);
                    this.dispatchEvent(InputEvents_1.InputEvents.DisableInputsEvent);
                    this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockUnselectedEvent, this._currentlySelectedCoord);
                    this.addBlockSwapEventListeners();
                    this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockSwapAnimationEvent, payload);
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
                this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockUnselectedEvent, resetSelectedCoord);
            }
            if (resetSwapCoord != undefined) {
                this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockUnselectedEvent, resetSwapCoord);
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
            this.dispatchEvent(TimerEvents_1.TimerEvents.StartTimeEvent);
            this.dispatchEvent(SoundEvents_2.SoundEvents.PlayBGMEvent);
            this.dispatchEvent(InputEvents_1.InputEvents.EnableInputsEvent);
        }
        onTimeExpiredEvent() {
            this.dispatchEvent(InputEvents_1.InputEvents.DisableInputsEvent);
        }
        addBlockSwapEventListeners() {
            this.addEventListener(GridEvents_1.GridEvents.SelectedBlockSwapAnimationCompleteEvent, this.onSelectedBlockSwapComplete.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this.onSwapCandidateBlockSwapComplete.bind(this));
        }
        removeBlockSwapEventListeners() {
            this.removeEventListener(GridEvents_1.GridEvents.SelectedBlockSwapAnimationCompleteEvent);
            this.removeEventListener(GridEvents_1.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent);
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
            this.dispatchEvent(GridEvents_1.GridEvents.BlockSwapAnimationCompleteEvent);
            this.addGridEvaluationEventListeners();
            this.dispatchEvent(GridEvents_1.GridEvents.EvaluateGridEvent);
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
            this.addEventListener(GridEvents_1.GridEvents.BreakAndCascadeBlocksCompleteEvent, this.onBreakAndCascaseBlocksCompleteEvent.bind(this));
            this.dispatchEvent(GridEvents_1.GridEvents.BreakAndCascadeBlocksEvent, message);
        }
        onBreakAndCascaseBlocksCompleteEvent(message) {
            console.log("GridModel.onBreakAndCascaseBlocksCompleteEvent()");
            this.addGridEvaluationEventListeners();
            this.dispatchEvent(GridEvents_1.GridEvents.EvaluateGridEvent);
        }
        onGridEvaluationNegativeEvent(message) {
            this.removeGridEvaluationEventListeners();
            let negativeEvaluationWasResultOfASwap = this._currentlySelectedCoord != undefined && this._swapCandidateCoord != undefined;
            let selectedCoord = this._currentlySelectedCoord;
            let swapCandidateCoord = this._swapCandidateCoord;
            this.resetSelectedAndSwapCoords;
            if (negativeEvaluationWasResultOfASwap) {
                //bogus way of checking that this evaluation is a result of a swap.
                this.dispatchEvent(GridEvents_1.GridEvents.ShowBlockSwapAnimationEvent, new SwapVO_1.SwapVO(selectedCoord, swapCandidateCoord));
                this.deselectAll();
                this.dispatchEvent(InputEvents_1.InputEvents.EnableInputsEvent);
            }
            else {
                this.resetSelectedAndSwapCoords;
                this.addEventListener(GridEvents_1.GridEvents.RefillGridCompleteEvent, this.onRefillGridCompleteEvent.bind(this));
                this.dispatchEvent(GridEvents_1.GridEvents.RefillGridEvent);
            }
        }
        onRefillGridCompleteEvent() {
            this.removeEventListener(GridEvents_1.GridEvents.RefillGridCompleteEvent);
            this.addRefillEvaluationEventListeners();
            this.dispatchEvent(GridEvents_1.GridEvents.EvaluateGridEvent);
        }
        addRefillEvaluationEventListeners() {
            this.addEventListener(GridEvents_1.GridEvents.GridEvaluationPositiveEvent, this.onGridEvaluationSuccessEvent.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.GridEvaluationNegativeEvent, this.onRefillEvaluationNegativeEvent.bind(this));
        }
        onRefillEvaluationNegativeEvent() {
            this.dispatchEvent(InputEvents_1.InputEvents.EnableInputsEvent);
        }
        addGridEvaluationEventListeners() {
            this.addEventListener(GridEvents_1.GridEvents.GridEvaluationPositiveEvent, this.onGridEvaluationSuccessEvent.bind(this));
            this.addEventListener(GridEvents_1.GridEvents.GridEvaluationNegativeEvent, this.onGridEvaluationNegativeEvent.bind(this));
        }
        removeGridEvaluationEventListeners() {
            this.removeEventListener(GridEvents_1.GridEvents.GridEvaluationPositiveEvent);
            this.removeEventListener(GridEvents_1.GridEvents.GridEvaluationNegativeEvent);
        }
    }
    exports.GridStateController = GridStateController;
});
define("Gravity/GravityEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GravityEvents {
    }
    GravityEvents.GravityRotateRightEvent = "GravityEvents.GravityRotateRight";
    GravityEvents.GravityRotateLeftEvent = "GravityEvents.GravityRotateLeft";
    exports.GravityEvents = GravityEvents;
});
define("Background/PlanetEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlanetEvents {
    }
    PlanetEvents.StartPlanetMoveEvent = "PlanetEvents.StartPlanetMove";
    PlanetEvents.PlanetMoveCompleteEvent = "PlanetEvents.PlanetMoveComplete";
    exports.PlanetEvents = PlanetEvents;
});
define("Input/InputController", ["require", "exports", "System/Events/EventHandler", "Block/BlockEvents", "Input/InputEvents", "Gravity/GravityEvent", "Background/PlanetEvents", "System/Time/TimerEvents"], function (require, exports, EventHandler_3, BlockEvents_2, InputEvents_2, GravityEvent_1, PlanetEvents_1, TimerEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InputController extends EventHandler_3.EventHandler {
        constructor(injectedEventHub, injectedGridModel) {
            super(injectedEventHub);
            this._gridModel = injectedGridModel;
            this.addEventListener(InputEvents_2.InputEvents.EnableInputsEvent, this.unlockUserInput.bind(this));
            this.addEventListener(InputEvents_2.InputEvents.DisableInputsEvent, this.lockUserInput.bind(this));
            this.addEventListener(TimerEvents_2.TimerEvents.TimeExpiredEvent, this.onTimeOverEvent.bind(this));
        }
        unlockUserInput() {
            this.addEventListener(BlockEvents_2.BlockEvents.BlockTouchedEvent, this.onBlockTouched.bind(this));
            this.addEventListener(InputEvents_2.InputEvents.RotateRightTouched, this.onRotateLeftTouched.bind(this));
            this.addEventListener(InputEvents_2.InputEvents.RotateLeftTouched, this.onRotateRightTouched.bind(this));
        }
        lockUserInput() {
            this.removeEventListener(BlockEvents_2.BlockEvents.BlockTouchedEvent);
            this.removeEventListener(InputEvents_2.InputEvents.RotateRightTouched);
            this.removeEventListener(InputEvents_2.InputEvents.RotateLeftTouched);
        }
        //This is naughty. We're controlling too much state in the gravity stuff in here really. But this would be remedied by a proper state machine.
        onRotateRightTouched() {
            this.lockUserInput();
            this.dispatchEvent(GravityEvent_1.GravityEvents.GravityRotateRightEvent);
            this.addEventListener(PlanetEvents_1.PlanetEvents.PlanetMoveCompleteEvent, this.unlockUserInput.bind(this));
            this.dispatchEvent(PlanetEvents_1.PlanetEvents.StartPlanetMoveEvent);
        }
        onRotateLeftTouched() {
            this.lockUserInput();
            this.dispatchEvent(GravityEvent_1.GravityEvents.GravityRotateLeftEvent);
            this.addEventListener(PlanetEvents_1.PlanetEvents.PlanetMoveCompleteEvent, this.unlockUserInput.bind(this));
            this.dispatchEvent(PlanetEvents_1.PlanetEvents.StartPlanetMoveEvent);
        }
        onBlockTouched(message) {
            this._gridModel.selectBlock(message);
        }
        onTimeOverEvent() {
            this.removeEventListener(InputEvents_2.InputEvents.EnableInputsEvent);
            //this is because if there's a pending enable event when the time runs out, the input will unlock after the time expires.
            this.lockUserInput();
        }
    }
    exports.InputController = InputController;
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
define("Grid/GridEvaluator", ["require", "exports", "Grid/VOs/BreakVO", "typescript-collections", "System/Events/EventHandler", "Grid/GridEvents"], function (require, exports, BreakVO_1, typescript_collections_2, EventHandler_4, GridEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridEvaluator extends EventHandler_4.EventHandler {
        constructor(injectedEventHub, injectedNodeMesh) {
            super(injectedEventHub);
            this._gridNodes = injectedNodeMesh;
            this.addEventListener(GridEvents_2.GridEvents.EvaluateGridEvent, this.onEvaluateGridEvent.bind(this));
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
                this.dispatchEvent(GridEvents_2.GridEvents.GridEvaluationPositiveEvent, breakVOs);
            }
            else {
                this.dispatchEvent(GridEvents_2.GridEvents.GridEvaluationNegativeEvent);
            }
        }
        evaluateNode(gridNode, breakVOs) {
            if (this.nodeExistsInExistingBreak(gridNode, breakVOs) || !gridNode.isOccupied) {
                return;
            }
            let colour = gridNode.getCurrentBlock().blockColour;
            let totalVerticalBreak = this.searchAboveNode(gridNode.nodeAbove, [], colour).concat(gridNode).concat(this.searchBelowNode(gridNode.nodeBelow, [], colour));
            let totalHorizontalBreak = this.searchLeftNode(gridNode.nodeLeft, [], colour).concat(gridNode).concat(this.searchRightNode(gridNode.nodeRight, [], colour));
            let set = new typescript_collections_2.Set();
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
define("Grid/NodeMeshFactory", ["require", "exports", "Grid/GridNode", "typescript-collections", "Grid/NodeMesh"], function (require, exports, GridNode_1, typescript_collections_3, NodeMesh_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NodeMeshFactory {
        createNodeMesh(dimensionsInNodes) {
            this._dimensionsInNodes = dimensionsInNodes;
            this._nodeMesh = this.createUnassociatedNodeMesh(this._dimensionsInNodes);
            this._spawnNodeMesh = new typescript_collections_3.Dictionary();
            this.associateNodeMesh(this._nodeMesh);
            return new NodeMesh_1.NodeMesh(this._nodeMesh, this._spawnNodeMesh, this._dimensionsInNodes);
        }
        createUnassociatedNodeMesh(_dimensionsInNodes) {
            let toStr = (key) => {
                return `${key.x},${key.y}`;
            };
            let nodeMesh = new typescript_collections_3.Dictionary(toStr);
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
define("Cascade/BaseCascadeStrategy", ["require", "exports", "Cascade/SpawnData", "Grid/VOs/CascadeVO"], function (require, exports, SpawnData_1, CascadeVO_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseCascadeStrategy {
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
            let spawnNodeCoords = this.getSpawnCoordForNode(destinationNode);
            //-1 because it's the invisible 'SpawnNode' at the top;
            return new SpawnData_1.SpawnData(this._nodeMesh.spawnNodes.getValue(spawnNodeCoords), destinationNode);
        }
        getSpawnCoordForNode(node) {
            throw new Error("Override in child class");
        }
        findNextUnoccupiedNode() {
            throw new Error("Override in child class");
        }
        getFirstUnoccupiedNodeInRow(row) {
            for (let i = 0; i < this._nodeMesh.dimensionsInNodes.x; i++) {
                let nodeToCheck = this._nodeMesh.nodes.getValue(new Phaser.Point(i, row));
                if (!nodeToCheck.isOccupied) {
                    return nodeToCheck;
                }
            }
            return undefined;
        }
        getFirstUnoccupiedNodeInColumn(column) {
            for (let j = 0; j < this._nodeMesh.dimensionsInNodes.y; j++) {
                let nodeToCheck = this._nodeMesh.nodes.getValue(new Phaser.Point(column, j));
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
            let distanceToCascade = this.getNumberOfEmptyNodesInCascadePath(node, 0);
            if (node.isOccupied) {
                let cascadeDestination = this.getCascadeDestinationForNode(node, distanceToCascade);
                let cascadeVO = new CascadeVO_1.CascadeVO(node.getCurrentBlock(), cascadeDestination);
                return cascadeVO;
            }
            else {
                return undefined;
            }
        }
        getNumberOfEmptyNodesInCascadePath(node, emptyNodesSoFar) {
            throw new Error("Override in child class");
        }
        getCascadeDestinationForNode(node, distanceToCascade) {
            throw new Error("Override in child class");
        }
    }
    exports.BaseCascadeStrategy = BaseCascadeStrategy;
});
define("Cascade/DownCascadeStrategy", ["require", "exports", "Cascade/BaseCascadeStrategy"], function (require, exports, BaseCascadeStrategy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DownCascadeStrategy extends BaseCascadeStrategy_1.BaseCascadeStrategy {
        constructor(nodeMesh) {
            super(nodeMesh);
        }
        getSpawnCoordForNode(node) {
            //y = -1 as we want to spawn from the top.
            return new Phaser.Point(node.gridCoordinate.x, -1);
        }
        findNextUnoccupiedNode() {
            for (let j = this._nodeMesh.dimensionsInNodes.y - 1; j >= 0; j--) {
                //counting backwards, as we wanna check from the bottom up
                let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInRow(j);
                if (potentiallyUnoccupiedNode != undefined) {
                    return potentiallyUnoccupiedNode;
                }
            }
            return undefined;
        }
        getNumberOfEmptyNodesInCascadePath(node, emptyNodesSoFar) {
            if (!node.isOccupied) {
                emptyNodesSoFar++;
            }
            if (node.nodeBelow != undefined) {
                return this.getNumberOfEmptyNodesInCascadePath(node.nodeBelow, emptyNodesSoFar);
            }
            else {
                return emptyNodesSoFar;
            }
        }
        getCascadeDestinationForNode(node, distanceToCascade) {
            return new Phaser.Point(node.gridCoordinate.x, node.gridCoordinate.y + distanceToCascade);
        }
    }
    exports.DownCascadeStrategy = DownCascadeStrategy;
});
define("Cascade/UpCascadeStrategy", ["require", "exports", "Cascade/BaseCascadeStrategy"], function (require, exports, BaseCascadeStrategy_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UpCascadeStrategy extends BaseCascadeStrategy_2.BaseCascadeStrategy {
        constructor(nodeMesh) {
            super(nodeMesh);
        }
        getSpawnCoordForNode(node) {
            //y = max as we want to spawn from the bottom.
            return new Phaser.Point(node.gridCoordinate.x, this._nodeMesh.dimensionsInNodes.y);
        }
        findNextUnoccupiedNode() {
            for (let j = 0; j < this._nodeMesh.dimensionsInNodes.y; j++) {
                //counting forwards, as we wanna check from the top down
                let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInRow(j);
                if (potentiallyUnoccupiedNode != undefined) {
                    return potentiallyUnoccupiedNode;
                }
            }
            return undefined;
        }
        getNumberOfEmptyNodesInCascadePath(node, emptyNodesSoFar) {
            if (!node.isOccupied) {
                emptyNodesSoFar++;
            }
            if (node.nodeAbove != undefined) {
                return this.getNumberOfEmptyNodesInCascadePath(node.nodeAbove, emptyNodesSoFar);
            }
            else {
                return emptyNodesSoFar;
            }
        }
        getCascadeDestinationForNode(node, distanceToCascade) {
            return new Phaser.Point(node.gridCoordinate.x, node.gridCoordinate.y - distanceToCascade);
        }
    }
    exports.UpCascadeStrategy = UpCascadeStrategy;
});
define("Cascade/LeftCascadeStrategy", ["require", "exports", "Cascade/BaseCascadeStrategy"], function (require, exports, BaseCascadeStrategy_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LeftCascadeStrategy extends BaseCascadeStrategy_3.BaseCascadeStrategy {
        constructor(nodeMesh) {
            super(nodeMesh);
        }
        getSpawnCoordForNode(node) {
            //y = max as we want to spawn from the bottom.
            return new Phaser.Point(this._nodeMesh.dimensionsInNodes.x, node.gridCoordinate.y);
        }
        findNextUnoccupiedNode() {
            for (let j = 0; j < this._nodeMesh.dimensionsInNodes.y; j++) {
                //counting forwards, as we wanna check from the top down
                let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInColumn(j);
                if (potentiallyUnoccupiedNode != undefined) {
                    return potentiallyUnoccupiedNode;
                }
            }
            return undefined;
        }
        getNumberOfEmptyNodesInCascadePath(node, emptyNodesSoFar) {
            if (!node.isOccupied) {
                emptyNodesSoFar++;
            }
            if (node.nodeLeft != undefined) {
                return this.getNumberOfEmptyNodesInCascadePath(node.nodeLeft, emptyNodesSoFar);
            }
            else {
                return emptyNodesSoFar;
            }
        }
        getCascadeDestinationForNode(node, distanceToCascade) {
            return new Phaser.Point(node.gridCoordinate.x - distanceToCascade, node.gridCoordinate.y);
        }
    }
    exports.LeftCascadeStrategy = LeftCascadeStrategy;
});
define("Cascade/RightCascadeStrategy", ["require", "exports", "Cascade/BaseCascadeStrategy"], function (require, exports, BaseCascadeStrategy_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RightCascadeStrategy extends BaseCascadeStrategy_4.BaseCascadeStrategy {
        constructor(nodeMesh) {
            super(nodeMesh);
        }
        getSpawnCoordForNode(node) {
            //y = max as we want to spawn from the bottom.
            return new Phaser.Point(-1, node.gridCoordinate.y);
        }
        findNextUnoccupiedNode() {
            for (let j = this._nodeMesh.dimensionsInNodes.y - 1; j >= 0; j--) {
                //counting forwards, as we wanna check from the top down
                let potentiallyUnoccupiedNode = this.getFirstUnoccupiedNodeInColumn(j);
                if (potentiallyUnoccupiedNode != undefined) {
                    return potentiallyUnoccupiedNode;
                }
            }
            return undefined;
        }
        getNumberOfEmptyNodesInCascadePath(node, emptyNodesSoFar) {
            if (!node.isOccupied) {
                emptyNodesSoFar++;
            }
            if (node.nodeRight != undefined) {
                return this.getNumberOfEmptyNodesInCascadePath(node.nodeRight, emptyNodesSoFar);
            }
            else {
                return emptyNodesSoFar;
            }
        }
        getCascadeDestinationForNode(node, distanceToCascade) {
            return new Phaser.Point(node.gridCoordinate.x + distanceToCascade, node.gridCoordinate.y);
        }
    }
    exports.RightCascadeStrategy = RightCascadeStrategy;
});
define("Gravity/GravityStateModel", ["require", "exports", "Gravity/GravityState", "System/Events/EventHandler", "Gravity/GravityEvent"], function (require, exports, GravityState_1, EventHandler_5, GravityEvent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GravityStateModel extends EventHandler_5.EventHandler {
        constructor(injectedEventHub) {
            super(injectedEventHub);
            this._currentState = GravityState_1.GravityState.Down;
            this.addEventListener(GravityEvent_2.GravityEvents.GravityRotateLeftEvent, this.onGravityRotateLeftEvent.bind(this));
            this.addEventListener(GravityEvent_2.GravityEvents.GravityRotateRightEvent, this.onGravityRotateRightEvent.bind(this));
        }
        get currentState() {
            return this._currentState;
        }
        onGravityRotateLeftEvent() {
            switch (this._currentState) {
                case GravityState_1.GravityState.Down:
                    this._currentState = GravityState_1.GravityState.Left;
                    break;
                case GravityState_1.GravityState.Left:
                    this._currentState = GravityState_1.GravityState.Up;
                    break;
                case GravityState_1.GravityState.Up:
                    this._currentState = GravityState_1.GravityState.Right;
                    break;
                case GravityState_1.GravityState.Right:
                    this._currentState = GravityState_1.GravityState.Down;
                    break;
                default:
                    break;
            }
        }
        onGravityRotateRightEvent() {
            switch (this._currentState) {
                case GravityState_1.GravityState.Down:
                    this._currentState = GravityState_1.GravityState.Right;
                    break;
                case GravityState_1.GravityState.Right:
                    this._currentState = GravityState_1.GravityState.Up;
                    break;
                case GravityState_1.GravityState.Up:
                    this._currentState = GravityState_1.GravityState.Left;
                    break;
                case GravityState_1.GravityState.Left:
                    this._currentState = GravityState_1.GravityState.Down;
                    break;
                default:
                    break;
            }
        }
    }
    exports.GravityStateModel = GravityStateModel;
});
define("Cascade/CascadeStrategyProvider", ["require", "exports", "Cascade/DownCascadeStrategy", "Cascade/UpCascadeStrategy", "Cascade/LeftCascadeStrategy", "Cascade/RightCascadeStrategy", "Gravity/GravityState", "typescript-collections"], function (require, exports, DownCascadeStrategy_1, UpCascadeStrategy_1, LeftCascadeStrategy_1, RightCascadeStrategy_1, GravityState_2, typescript_collections_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CascadeStrategyProvider {
        constructor(nodeMesh, injectedGridStateModel) {
            this._gravityStateModel = injectedGridStateModel;
            this.initialiseStrategies(nodeMesh);
        }
        get cascadeStrategy() {
            return this._strategyStateMap.getValue(this._gravityStateModel.currentState);
            // return this._strategyStateMap.getValue(GravityState.Left);
        }
        initialiseStrategies(nodeMesh) {
            this._strategyStateMap = new typescript_collections_4.Dictionary();
            this._strategyStateMap.setValue(GravityState_2.GravityState.Down, new DownCascadeStrategy_1.DownCascadeStrategy(nodeMesh));
            this._strategyStateMap.setValue(GravityState_2.GravityState.Up, new UpCascadeStrategy_1.UpCascadeStrategy(nodeMesh));
            this._strategyStateMap.setValue(GravityState_2.GravityState.Left, new LeftCascadeStrategy_1.LeftCascadeStrategy(nodeMesh));
            this._strategyStateMap.setValue(GravityState_2.GravityState.Right, new RightCascadeStrategy_1.RightCascadeStrategy(nodeMesh));
        }
    }
    exports.CascadeStrategyProvider = CascadeStrategyProvider;
});
define("Score/ScoreEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ScoreEvents {
    }
    ScoreEvents.UpdateScoreForBlocksBrokenEvent = "ScoreEvents.UpdateScoreForBlocksBroken";
    exports.ScoreEvents = ScoreEvents;
});
define("Grid/GridController", ["require", "exports", "System/Events/EventHandler", "Grid/GridEvents", "Grid/VOs/SwapVO", "Score/ScoreEvents"], function (require, exports, EventHandler_6, GridEvents_3, SwapVO_2, ScoreEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridController extends EventHandler_6.EventHandler {
        constructor(injectedBlockFactory, injectedEventHub, injectedNodeMesh, injectedCascadeStrategyProvider) {
            super(injectedEventHub);
            this.addEventListener(GridEvents_3.GridEvents.InitialiseGridEvent, this.onInitialiseEvent.bind(this));
            this.addEventListener(GridEvents_3.GridEvents.ShowBlockSelectedEvent, this.onShowBlockSelectedEvent.bind(this));
            this.addEventListener(GridEvents_3.GridEvents.ShowBlockUnselectedEvent, this.onShowBlockUnselectedEvent.bind(this));
            this.addEventListener(GridEvents_3.GridEvents.ShowBlockSwapAnimationEvent, this.onShowBlockSwapAnimationEvent.bind(this));
            this.addEventListener(GridEvents_3.GridEvents.BreakAndCascadeBlocksEvent, this.onBreakBlocksEvent.bind(this));
            this.addEventListener(GridEvents_3.GridEvents.RefillGridEvent, this.onRefillGridEvent.bind(this));
            this._blockFactory = injectedBlockFactory;
            //TODO: move instantiation of NodeMeshFactory into bootstrap and 'inject'
            this._gridNodes = injectedNodeMesh;
            this._cascadeStrategyProvider = injectedCascadeStrategyProvider;
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
                this.dispatchEvent(GridEvents_3.GridEvents.InitialiseGridCompleteEvent);
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
            this.dispatchEvent(ScoreEvents_1.ScoreEvents.UpdateScoreForBlocksBrokenEvent, breakVos);
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
                        //We came up with a better way to do this in cascadeBlocks() ("this", being figure out when we're done)
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
                this.dispatchEvent(GridEvents_3.GridEvents.BreakAndCascadeBlocksCompleteEvent, this._gridNodes);
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
            this.dispatchEvent(GridEvents_3.GridEvents.BreakAndCascadeBlocksCompleteEvent, this._gridNodes);
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
                this.dispatchEvent(GridEvents_3.GridEvents.RefillGridCompleteEvent);
            }
        }
        onBlockReSpawnCompleteCallback(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            this.respawnBlocks();
        }
        onSelectedBlockMoveComplete(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
            this.dispatchEvent(GridEvents_3.GridEvents.SelectedBlockSwapAnimationCompleteEvent, this._gridNodes);
        }
        onSwapCandidateBlockMoveComplete(completedBlock) {
            completedBlock.blockMoveComplete = undefined;
            //This is bad. We shouldnt really be passing the nodemesh around as a payload but we're running low on time.
            this.dispatchEvent(GridEvents_3.GridEvents.SwapCandidateBlockSwapAnimationCompleteEvent, this._gridNodes);
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
define("Score/ScoreModel", ["require", "exports", "System/Events/EventHandler", "Score/ScoreEvents"], function (require, exports, EventHandler_7, ScoreEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ScoreModel extends EventHandler_7.EventHandler {
        constructor(injectedEventHub) {
            super(injectedEventHub);
            this.SCORE_PER_BLOCK = 100;
            this._currentScore = 0;
            this.addEventListener(ScoreEvents_2.ScoreEvents.UpdateScoreForBlocksBrokenEvent, this.onUpdateScoreEvent.bind(this));
        }
        onUpdateScoreEvent(breakVOs) {
            let totalBlocksBroken = 0;
            for (let i = 0; i < breakVOs.length; i++) {
                totalBlocksBroken += breakVOs[i].coords.size();
            }
            let additionalScore = totalBlocksBroken * this.SCORE_PER_BLOCK;
            this._currentScore += additionalScore;
            if (this.scoreUpdated != undefined) {
                this.scoreUpdated(this._currentScore, additionalScore);
            }
        }
    }
    exports.ScoreModel = ScoreModel;
});
define("Sound/SoundController", ["require", "exports", "System/Events/EventHandler", "Sound/SoundEvents", "System/Assets"], function (require, exports, EventHandler_8, SoundEvents_3, Assets_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SoundController extends EventHandler_8.EventHandler {
        constructor(injectedGame, injectedEventHub) {
            super(injectedEventHub);
            this._game = injectedGame;
            this.addEventListener(SoundEvents_3.SoundEvents.PlayBGMEvent, this.onPlayBGMEvent.bind(this));
            this.addEventListener(SoundEvents_3.SoundEvents.PlayExplosionEvent, this.onPlayExplosionSFXEvent.bind(this));
            this.addEventListener(SoundEvents_3.SoundEvents.PlayCascadeEvent, this.onPlayCascadeSFXEvent.bind(this));
        }
        initialise() {
            this._explosion = this._game.add.audio(Assets_2.Assets.SFXBreak);
            this._bgm = this._game.add.audio(Assets_2.Assets.SFXBgm, 1, true);
            this._cascade = this._game.add.audio(Assets_2.Assets.SFXCascade, 0.7);
        }
        ////
        //Obviously in a more complex game we would map these into a dictionary with keys, and pass that key as a payload through a single event
        ////
        onPlayBGMEvent() {
            this._bgm.play();
        }
        onPlayExplosionSFXEvent() {
            this._explosion.play();
        }
        onPlayCascadeSFXEvent() {
            this._cascade.play();
        }
    }
    exports.SoundController = SoundController;
});
define("System/SystemModel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //////
    //This class is essentially a BTEC program context
    //////
    class SystemModel {
        get soundController() {
            return this._soundController;
        }
        set soundController(value) {
            this._soundController = value;
        }
        get scoreModel() {
            return this._scoreModel;
        }
        set scoreModel(value) {
            this._scoreModel = value;
        }
        get nodeMesh() {
            return this._nodeMesh;
        }
        set nodeMesh(value) {
            this._nodeMesh = value;
        }
        get cascadeStrategyProvider() {
            return this._cascadeStrategyProvider;
        }
        set cascadeStrategyProvider(value) {
            this._cascadeStrategyProvider = value;
        }
        get gravityStateModel() {
            return this._gravityStateModel;
        }
        set gravityStateModel(value) {
            this._gravityStateModel = value;
        }
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
define("Background/PlanetView", ["require", "exports", "System/View", "Gravity/GravityState", "typescript-collections", "System/Assets"], function (require, exports, View_2, GravityState_3, typescript_collections_5, Assets_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlanetView extends View_2.View {
        constructor(injectedGame, layerGroup) {
            super(injectedGame, layerGroup);
            //We're going to hardcode these here for time's sake. They could be moved to a model based on the grid/game dimensions at some point.
            //also we won't take the "gridoffset" the blocks have into account.
            this.PLANET_TOP_POS = new Phaser.Point(288, -100);
            this.PLANET_BOTTOM_POS = new Phaser.Point(288, 600 + 100);
            this.PLANET_LEFT_POS = new Phaser.Point(-100, 288);
            this.PLANET_RIGHT_POS = new Phaser.Point(576 + 100, 288);
            this.PLANET_MOVE_DURATION = 1500;
        }
        initialise() {
            this._gravityStatePlanetLocationMap = new typescript_collections_5.Dictionary();
            this._gravityStatePlanetLocationMap.setValue(GravityState_3.GravityState.Up, this.PLANET_TOP_POS);
            this._gravityStatePlanetLocationMap.setValue(GravityState_3.GravityState.Down, this.PLANET_BOTTOM_POS);
            this._gravityStatePlanetLocationMap.setValue(GravityState_3.GravityState.Left, this.PLANET_LEFT_POS);
            this._gravityStatePlanetLocationMap.setValue(GravityState_3.GravityState.Right, this.PLANET_RIGHT_POS);
            let startingPosition = this.PLANET_BOTTOM_POS;
            this._planetSprite = this.layerGroup.create(startingPosition.x, startingPosition.y, Assets_3.Assets.SpritePlanet);
            this._planetSprite.scale = new Phaser.Point(1.5, 1.5);
            this._planetSprite.anchor = new Phaser.Point(0.5, 0.5);
        }
        //We could make this movement much, much smoother and more circular with clever use of easing functions. But that's for another time.
        movePlanet(gravityState, onComplete) {
            let destination = this._gravityStatePlanetLocationMap.getValue(gravityState);
            let tweenX = this.game.add.tween(this._planetSprite).to({
                x: destination.x,
                y: destination.y
            }, this.PLANET_MOVE_DURATION, Phaser.Easing.Linear.None, false);
            // let tweenY: Phaser.Tween =this.game.add.tween(this._planetSprite).to({
            //     y: destination.y
            // },this.PLANET_MOVE_DURATION, Phaser.Easing.Quintic.In, false);
            tweenX.onComplete.add(onComplete);
            tweenX.start();
            // tweenY.start();
        }
    }
    exports.PlanetView = PlanetView;
});
define("Background/PlanetMediator", ["require", "exports", "System/Mediator", "Background/PlanetEvents"], function (require, exports, Mediator_2, PlanetEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlanetMediator extends Mediator_2.Mediator {
        constructor(injectedGravityStateModel, injectedView, injectedEventHub) {
            super(injectedEventHub);
            this._gravityStateModel = injectedGravityStateModel;
            this._planetView = injectedView;
            this._planetView.initialise();
            this.addEventListener(PlanetEvents_2.PlanetEvents.StartPlanetMoveEvent, this.onMovePlanetEvent.bind(this));
        }
        onMovePlanetEvent() {
            this._planetView.movePlanet(this._gravityStateModel.currentState, this.onPlanetMoveComplete.bind(this));
        }
        onPlanetMoveComplete() {
            this.dispatchEvent(PlanetEvents_2.PlanetEvents.PlanetMoveCompleteEvent);
        }
    }
    exports.PlanetMediator = PlanetMediator;
});
define("System/Time/Timer", ["require", "exports", "System/Events/EventHandler", "System/Time/TimerEvents"], function (require, exports, EventHandler_9, TimerEvents_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Timer extends EventHandler_9.EventHandler {
        constructor(injectedGame, injectedEventHub, gameConfig) {
            super(injectedEventHub);
            this._game = injectedGame;
            this._timeRemaining = gameConfig.time;
            this.addEventListener(TimerEvents_3.TimerEvents.StartTimeEvent, this.onStartTimerEvent.bind(this));
        }
        onStartTimerEvent() {
            this._timerEvent = this._game.time.events.loop(Phaser.Timer.SECOND, this.onInterval.bind(this), this);
        }
        onTimeExpired() {
            this._game.time.events.remove(this._timerEvent);
            this.dispatchEvent(TimerEvents_3.TimerEvents.TimeExpiredEvent);
        }
        onInterval() {
            this._timeRemaining--;
            if (this._timeRemaining < 0) {
                this.onTimeExpired();
            }
            else {
                this.dispatchEvent(TimerEvents_3.TimerEvents.TimeIntervalElapsedEvent, this._timeRemaining);
            }
        }
    }
    exports.Timer = Timer;
});
define("ControlPanel/ControlPanelView", ["require", "exports", "System/View"], function (require, exports, View_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ControlPanelView extends View_3.View {
        constructor(injectedGame, injectedLayerGroup, gameConfig) {
            super(injectedGame, injectedLayerGroup);
            this.ROTATE_LEFT_DIMS = new Phaser.Rectangle(600, 340, 180, 100);
            this.ROTATE_RIGHT_DIMS = new Phaser.Rectangle(600, 460, 180, 100);
            this.BACKGROUND_PANEL_DIMS = new Phaser.Rectangle(580, 0, 220, 600);
            this.SCORE_POS = new Phaser.Point(620, 220);
            this.TIME_POS = new Phaser.Point(640, 80);
            this.SCORE_TWEEN_DURATION = 500;
            this._textStyle = { font: "37px Arial", fill: "#000000", align: "center" };
            this._gameConfig = gameConfig;
        }
        initialise() {
            this.initialiseButtons();
            this._score = 0;
            this.initialiseScore();
            this.initiliseTimer();
        }
        //These are only public so that the tween may tick them
        set score(value) {
            this._score = Math.floor(value);
            this._scoreText.text = `SCORE\n${this._score}`;
        }
        get score() {
            //we need a getter otherwise the tween won't work. It'll start from zero every time, as i presume the tween class cant access the prop.
            return this._score;
        }
        initiliseTimer() {
            this._timeRemainingtext = this.game.add.text(this.TIME_POS.x, this.TIME_POS.y, `TIME\n${this._gameConfig.time}`, this._textStyle, this.layerGroup);
        }
        initialiseScore() {
            this._scoreText = this.game.add.text(this.SCORE_POS.x, this.SCORE_POS.y, `SCORE\n${this._score}`, this._textStyle, this.layerGroup);
        }
        initialiseButtons() {
            this._backgroundPanel = this.game.add.graphics(this.BACKGROUND_PANEL_DIMS.x, this.BACKGROUND_PANEL_DIMS.y, this.layerGroup);
            this._backgroundPanel.beginFill(0x767676);
            this._backgroundPanel.drawRect(0, 0, this.BACKGROUND_PANEL_DIMS.width, this.BACKGROUND_PANEL_DIMS.height);
            this._backgroundPanel.endFill();
            // this._rotateLeftButton = this.game.add.graphics(this.ROTATE_LEFT_DIMS.x, this.ROTATE_LEFT_DIMS.y, this.layerGroup);
            // this._rotateRightButton = this.game.add.graphics(this.ROTATE_RIGHT_DIMS.x, this.ROTATE_RIGHT_DIMS.y, this.layerGroup);
            // this._rotateLeftButton.beginFill(0xFFFFFF);
            // this._rotateRightButton.beginFill(0xFFFFFF);
            // this._rotateLeftButton.drawRect(0,0,this.ROTATE_LEFT_DIMS.width,this.ROTATE_LEFT_DIMS.height);
            // this._rotateRightButton.drawRect(0,0,this.ROTATE_RIGHT_DIMS.width,this.ROTATE_RIGHT_DIMS.height);
            // this._rotateLeftButton.endFill();
            // this._rotateRightButton.endFill();
            // this._rotateLeftButton.inputEnabled = true;
            // this._rotateRightButton.inputEnabled = true;
            // this._rotateLeftButton.events.onInputDown.add(this.onRotateLeftTouched,this);
            // this._rotateRightButton.events.onInputDown.add(this.onRotateRightTouched,this);
            // let textStyle = { font: "65px Arial", fill: "#000000" };
            // let leftArrow: Phaser.Text = this.game.add.text(this.ROTATE_LEFT_DIMS.centerX-20,this.ROTATE_LEFT_DIMS.centerY-30,"<",textStyle,this.layerGroup);
            // let rightArrow: Phaser.Text = this.game.add.text(this.ROTATE_RIGHT_DIMS.centerX-20,this.ROTATE_RIGHT_DIMS.centerY-30,">",textStyle,this.layerGroup);
        }
        updateTimer(timeRemaining) {
            this._timeRemainingtext.text = `TIME\n${timeRemaining}`;
        }
        updateScore(newScore, additionalAmount) {
            let tween = this.game.add.tween(this).to({
                score: newScore
            }, this.SCORE_TWEEN_DURATION, Phaser.Easing.Quadratic.In, false);
            tween.start();
        }
    }
    exports.ControlPanelView = ControlPanelView;
});
define("ControlPanel/ControlPanelMediator", ["require", "exports", "System/Mediator", "System/Time/TimerEvents"], function (require, exports, Mediator_3, TimerEvents_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ControlPanelMediator extends Mediator_3.Mediator {
        constructor(injectedScoreModel, injectedView, injectedEventHub) {
            super(injectedEventHub);
            this.addEventListener(TimerEvents_4.TimerEvents.TimeIntervalElapsedEvent, this.onUpdateTimerEvent.bind(this));
            this._scoreModel = injectedScoreModel;
            this._scoreModel.scoreUpdated = this.onScoreUpdated.bind(this);
            this._controlPanelView = injectedView;
            this._controlPanelView.initialise();
            // this._controlPanelView.rotateLeftTouched = this.onRotateLeftTouched.bind(this);
            // this._controlPanelView.rotateRightTouched = this.onRotateRightTouched.bind(this);
        }
        onScoreUpdated(newScore, additionalAmount) {
            this._controlPanelView.updateScore(newScore, additionalAmount);
        }
        onUpdateTimerEvent(timeRemaining) {
            this._controlPanelView.updateTimer(timeRemaining);
        }
    }
    exports.ControlPanelMediator = ControlPanelMediator;
});
define("System/Startup", ["require", "exports", "Block/BlockFactory", "System/SystemModel", "Grid/GridController", "System/Events/EventHub", "Grid/GridEvents", "Input/InputController", "Grid/GridStateController", "Grid/GridEvaluator", "Grid/NodeMeshFactory", "Gravity/GravityStateModel", "Cascade/CascadeStrategyProvider", "Background/PlanetView", "Background/PlanetMediator", "ControlPanel/ControlPanelView", "ControlPanel/ControlPanelMediator", "Score/ScoreModel", "System/Time/Timer", "Sound/SoundController"], function (require, exports, BlockFactory_1, SystemModel_1, GridController_1, EventHub_1, GridEvents_4, InputController_1, GridStateController_1, GridEvaluator_1, NodeMeshFactory_1, GravityStateModel_1, CascadeStrategyProvider_1, PlanetView_1, PlanetMediator_1, ControlPanelView_1, ControlPanelMediator_1, ScoreModel_1, Timer_1, SoundController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Startup {
        constructor(game, gameConfig) {
            this._game = game;
            this._gameConfig = gameConfig;
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
            this.bootstrapEventHub();
            this.bootstrapModels();
            this.bootstrapNodes();
            this.bootstrapSound();
            this.bootstrapInput();
            this.bootstrapTimer();
            this.bootstrapCascadeStrategy();
            this.bootstrapBackground();
            this.bootstrapBlockFactory();
            this.bootstrapGrid();
            this.bootstrapControlPanel();
        }
        bootstrapEventHub() {
            this._systemModel.eventHub = new EventHub_1.EventHub();
        }
        bootstrapCascadeStrategy() {
            this._systemModel.cascadeStrategyProvider = new CascadeStrategyProvider_1.CascadeStrategyProvider(this._systemModel.nodeMesh, this._systemModel.gravityStateModel);
        }
        bootstrapBlockFactory() {
            let blockLayerGroup = this._game.add.group();
            let blockFactory = new BlockFactory_1.BlockFactory(this._game, blockLayerGroup, this._systemModel.eventHub, this._gameConfig);
            this._systemModel.blockFactory = blockFactory;
        }
        bootstrapBackground() {
            let backgroundLayerGroup = this._game.add.group();
            let planetView = new PlanetView_1.PlanetView(this._game, backgroundLayerGroup);
            let planetMediator = new PlanetMediator_1.PlanetMediator(this._systemModel.gravityStateModel, planetView, this._systemModel.eventHub);
        }
        bootstrapInput() {
            let inputController = new InputController_1.InputController(this._systemModel.eventHub, this._systemModel.gridModel);
            this._systemModel.inputController = inputController;
        }
        bootstrapModels() {
            this._systemModel.gridModel = new GridStateController_1.GridStateController(this._systemModel.eventHub);
            this._systemModel.gravityStateModel = new GravityStateModel_1.GravityStateModel(this._systemModel.eventHub);
            this._systemModel.scoreModel = new ScoreModel_1.ScoreModel(this._systemModel.eventHub);
        }
        bootstrapNodes() {
            let nodeMesh = new NodeMeshFactory_1.NodeMeshFactory().createNodeMesh(this._gameConfig.gridSize);
            this._systemModel.nodeMesh = nodeMesh;
        }
        bootstrapGrid() {
            let gridEvaluator = new GridEvaluator_1.GridEvaluator(this._systemModel.eventHub, this._systemModel.nodeMesh);
            let gridController = new GridController_1.GridController(this._systemModel.blockFactory, this._systemModel.eventHub, this._systemModel.nodeMesh, this._systemModel.cascadeStrategyProvider);
            this._systemModel.gridEvaluator = gridEvaluator;
            this._systemModel.gridController = gridController;
        }
        bootstrapControlPanel() {
            let controlPanelLayerGroup = this._game.add.group();
            let controlPanelView = new ControlPanelView_1.ControlPanelView(this._game, controlPanelLayerGroup, this._gameConfig);
            let controlPanelMediator = new ControlPanelMediator_1.ControlPanelMediator(this._systemModel.scoreModel, controlPanelView, this._systemModel.eventHub);
        }
        bootstrapSound() {
            let soundController = new SoundController_1.SoundController(this._game, this._systemModel.eventHub);
            soundController.initialise();
            this._systemModel.soundController = soundController;
        }
        bootstrapTimer() {
            // It might look here like nothing is holding a reference to this, so GC is a threat.
            // But actually, it's events tether it to the event hub. Could go in the system model, to be sure, but time and stuff.
            let timer = new Timer_1.Timer(this._game, this._systemModel.eventHub, this._gameConfig);
        }
        get systemModel() {
            return this._systemModel;
        }
    }
    exports.Startup = Startup;
});
define("System/Config/GameConfigParser", ["require", "exports", "System/Config/GameConfigModel", "Gravity/GravityState"], function (require, exports, GameConfigModel_1, GravityState_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameConfigParser {
        parse(configJson) {
            let configModel = new GameConfigModel_1.GameConfigModel();
            this.parseGridConfig(configJson, configModel);
            this.parseBlocksConfig(configJson, configModel);
            this.parseMiscConfig(configJson, configModel);
            return configModel;
        }
        parseGridConfig(configJson, configModel) {
            configModel.gridPosition = new Phaser.Point(configJson.grid.gridPositionX, configJson.grid.gridPositionY);
            configModel.gridSize = new Phaser.Point(configJson.grid.gridWidth, configJson.grid.gridHeight);
            let cascadeDirectionID;
            try {
                cascadeDirectionID = configJson.grid.cascadeDirection;
            }
            catch (e) {
                throw new Error(`Config Parsing Error: Configured cascade direction value \"${configJson.grid.cascadeDirection}\" does not match any given value of the GravityState enum`);
            }
            configModel.cascadeDirection = GravityState_4.GravityState[cascadeDirectionID];
        }
        parseBlocksConfig(configJson, configModel) {
            configModel.blockSize = configJson.blocks.blockSize;
            configModel.blockPadding = configJson.blocks.blockPadding;
            configModel.blockSelectionDuration = configJson.blocks.selectionDuration;
            configModel.blockFallDuration = configJson.blocks.fallDuration;
            configModel.blockInitialSpawnFallDuration = configJson.blocks.initialSpawnFallDuration;
            configModel.blockRepawnFallDuration = configJson.blocks.respawnFallDuration;
            configModel.blockSwapDuration = configJson.blocks.swapDuration;
        }
        parseMiscConfig(configJson, configModel) {
            configModel.time = configJson.time;
            configModel.targetScore = configJson.targetScore;
        }
    }
    exports.GameConfigParser = GameConfigParser;
});
define("GravityBreak", ["require", "exports", "System/Startup", "System/Assets", "System/Config/GameConfigParser"], function (require, exports, Startup_1, Assets_4, GameConfigParser_1) {
    "use strict";
    class GravityBreakGame {
        constructor() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        }
        preload() {
            let loadTheRestFunc = () => {
                console.log('config complete');
                this.game.load.onFileComplete.remove(loadTheRestFunc, this);
                this._configModel = new GameConfigParser_1.GameConfigParser().parse(this.game.cache.getJSON(Assets_4.Assets.Config));
                this.game.load.spritesheet(Assets_4.Assets.SpriteDiamonds, "assets/diamonds32x5.png", 64, 64, 5);
                this.game.load.image(Assets_4.Assets.SpritePlanet, "assets/rock-planet.png");
                this.game.load.audio(Assets_4.Assets.SFXBreak, "assets/break-sfx.wav");
                this.game.load.audio(Assets_4.Assets.SFXCascade, "assets/cascading-sfx.wav");
                this.game.load.audio(Assets_4.Assets.SFXBgm, "assets/totally-open-source-bgm.mp3");
                this.game.stage.backgroundColor = 0x000000;
            };
            this.game.load.onFileComplete.add(loadTheRestFunc, this);
            this.game.load.onLoadComplete.add(() => {
                console.log('load complete');
            }, this);
            this.game.load.json(Assets_4.Assets.Config, "assets/config.json");
        }
        create() {
            console.log('create start');
            let startup = new Startup_1.Startup(this.game, this._configModel);
            startup.initialiseGame();
        }
    }
    return GravityBreakGame;
});
//# sourceMappingURL=gravityBreak.js.map