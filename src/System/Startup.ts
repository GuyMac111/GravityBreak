import { BlockFactory } from "../Block/BlockFactory";
import { SystemModel } from "./SystemModel";
import { ISystemModel } from "./ISystemModel";
import { GridController } from "../Grid/GridController";
import { EventHub } from "./Events/EventHub";
import { GridEvents } from "../Grid/GridEvents";
import { InputController } from "../Input/InputController";
import { GridStateController } from "../Grid/GridStateController";
import { GridEvaluator } from "../Grid/GridEvaluator";
import { NodeMeshFactory } from "../Grid/NodeMeshFactory";
import { NodeMesh } from "../Grid/NodeMesh";
import { GravityStateModel } from "../Gravity/GravityStateModel";
import { CascadeStrategyProvider } from "../Cascade/CascadeStrategyProvider";
import { PlanetView } from "../Background/PlanetView";
import { PlanetMediator } from "../Background/PlanetMediator";
import { ControlPanelView } from "../ControlPanel/ControlPanelView";
import { ControlPanelMediator } from "../ControlPanel/ControlPanelMediator";
import { ScoreModel } from "../Score/ScoreModel";
import { Timer } from "./Time/Timer";
import { SoundController } from "../Sound/SoundController";
import { IGameConfigModel } from "./Config/GameConfigModel";

export class Startup{
    private _game: Phaser.Game;

    private _systemModel: SystemModel;

    private _gameConfig: IGameConfigModel;
    
    constructor(game: Phaser.Game, gameConfig: IGameConfigModel){
        this._game = game;
        this._gameConfig = gameConfig;
    }
    
    initialiseGame(){
        this._systemModel = new SystemModel();
        this.bootstrapGame();
        this.initialise();
    }
    
    private initialise():void {
        this.systemModel.eventHub.dispatchEvent(GridEvents.InitialiseGridEvent);   
    }
    
    private bootstrapGame():void {
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

    private bootstrapEventHub():void {
        this._systemModel.eventHub = new EventHub();
    }
    
    private bootstrapCascadeStrategy(): void{
        this._systemModel.cascadeStrategyProvider = new CascadeStrategyProvider(this._systemModel.nodeMesh, this._systemModel.gravityStateModel);
    }

    private bootstrapBlockFactory():void {
        let blockLayerGroup: Phaser.Group = this._game.add.group();
        let blockFactory: BlockFactory = new BlockFactory(this._game, blockLayerGroup, this._systemModel.eventHub);
        this._systemModel.blockFactory = blockFactory;
    }

    private bootstrapBackground(): void{
        let backgroundLayerGroup: Phaser.Group = this._game.add.group();
        let planetView : PlanetView = new PlanetView(this._game, backgroundLayerGroup);
        let planetMediator : PlanetMediator = new PlanetMediator(this._systemModel.gravityStateModel,planetView, this._systemModel.eventHub); 
    }

    private bootstrapInput():void {
        let inputController: InputController = new InputController(this._systemModel.eventHub, this._systemModel.gridModel);
        this._systemModel.inputController = inputController; 
    }

    private bootstrapModels(): void {
        this._systemModel.gridModel = new GridStateController(this._systemModel.eventHub); 
        this._systemModel.gravityStateModel = new GravityStateModel(this._systemModel.eventHub);
        this._systemModel.scoreModel = new ScoreModel(this._systemModel.eventHub);
    }

    private bootstrapNodes(): void{
        let nodeMesh: NodeMesh = new NodeMeshFactory().createNodeMesh(this._gameConfig.gridSize);
        this._systemModel.nodeMesh = nodeMesh;
    }

    private bootstrapGrid(): void{
        let gridEvaluator:GridEvaluator = new GridEvaluator(this._systemModel.eventHub, this._systemModel.nodeMesh);
        let gridController: GridController = new GridController(this._systemModel.blockFactory, this._systemModel.eventHub, this._systemModel.nodeMesh, this._systemModel.cascadeStrategyProvider);
        this._systemModel.gridEvaluator = gridEvaluator;
        this._systemModel.gridController = gridController;
    }

    private bootstrapControlPanel(): void{
        let controlPanelLayerGroup: Phaser.Group = this._game.add.group();
        let controlPanelView: ControlPanelView = new ControlPanelView(this._game, controlPanelLayerGroup);
        let controlPanelMediator: ControlPanelMediator = new ControlPanelMediator(this._systemModel.scoreModel,controlPanelView, this._systemModel.eventHub);
    }

    private bootstrapSound(): void{
        let soundController:SoundController = new SoundController(this._game, this._systemModel.eventHub);
        soundController.initialise();
        this._systemModel.soundController = soundController;
    }

    private bootstrapTimer(): void{
        // It might look here like nothing is holding a reference to this, so GC is a threat.
        // But actually, it's events tether it to the event hub. Could go in the system model, to be sure, but time and stuff.
        let timer: Timer = new Timer(this._game, this._systemModel.eventHub);
    }

    get systemModel(): ISystemModel{
        return this._systemModel;
    }
}