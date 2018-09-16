import { SpawnData } from "./SpawnData";

export interface ICascadeStrategy{
    shouldSpawnBlock: boolean;
    nextSpawn: SpawnData;
}