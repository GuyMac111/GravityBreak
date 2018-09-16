import { SpawnData } from "./SpawnData";

export interface ICascadeStrategy{
    shouldSpawnBlock: boolean;
    getNextSpawn(): SpawnData;
}