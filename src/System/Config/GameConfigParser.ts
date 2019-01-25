import { GameConfigModel, IGameConfigModel } from "./GameConfigModel";
import { GravityState } from "../../Gravity/GravityState";

export class GameConfigParser{
    parse(configJson: any): IGameConfigModel{
        let configModel: GameConfigModel = new GameConfigModel();
        this.parseGridConfig(configJson, configModel);
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

    }

    private parseMiscConfig(configJson: any, configModel: GameConfigModel): void {

    }

}