import { SpawnData } from "./SpawnData";
import { CascadeVO } from "../Grid/VOs/CascadeVO";

export interface ICascadeStrategy{
    shouldSpawnBlock: boolean;
    nextSpawn: SpawnData;
    blocksToCascade: CascadeVO[];
}