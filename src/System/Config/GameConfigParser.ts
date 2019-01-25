import { GameConfigModel, IGameConfigModel } from "./GameConfigModel";
import { GravityState } from "../../Gravity/GravityState";

export class GameConfigParser{
    parse(configJson: any): IGameConfigModel{
        let configModel: GameConfigModel = new GameConfigModel();
        this.parseGridConfig(configJson, configModel);
        this.parseBlocksConfig(configJson, configModel);
        this.parseMiscConfig(configJson, configModel);
        return configModel;
    }

    private parseGridConfig(configJson: any, configModel: GameConfigModel): void {
        configModel.gridPosition = new Phaser.Point(configJson.grid.gridPositionX, configJson.grid.gridPositionY);
        configModel.gridSize = new Phaser.Point(configJson.grid.gridWidth, configJson.grid.gridHeight);
        let cascadeDirectionID: keyof typeof GravityState;
        try{
            cascadeDirectionID = configJson.grid.cascadeDirection;
        }catch(e){
            throw new Error(`Config Parsing Error: Configured cascade direction value \"${configJson.grid.cascadeDirection}\" does not match any given value of the GravityState enum`);
        }
        configModel.cascadeDirection = GravityState[cascadeDirectionID];

    }

    private parseBlocksConfig(configJson: any, configModel: GameConfigModel): void {
        configModel.blockSize = configJson.blocks.blockSize;
        configModel.blockPadding = configJson.blocks.blockPadding;
        configModel.blockSelectionDuration = configJson.blocks.selectionDuration;
        configModel.blockFallDuration = configJson.blocks.fallDuration;
        configModel.blockInitialSpawnFallDuration = configJson.blocks.initialSpawnFallDuration;
        configModel.blockRepawnFallDuration = configJson.blocks.respawnFallDuration;
        configModel.blockSwapDuration = configJson.blocks.swapDuration;
        configModel.blockSprites = configJson.blocks.blockSprites;
    }

    private parseMiscConfig(configJson: any, configModel: GameConfigModel): void {
        configModel.time = configJson.time;
        configModel.targetScore = configJson.targetScore;
    }

}