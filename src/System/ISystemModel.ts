import { BlockFactory } from "../Block/BlockFactory";
import { EventHub } from "./Events/EventHub";
import { InputController } from "../Input/InputController";
import { GridStateController } from "../Grid/GridStateController";
import { GridEvaluator } from "../Grid/GridEvaluator";

export interface ISystemModel{
    blockFactory: BlockFactory;
    eventHub: EventHub;
    inputController: InputController;
    gridModel: GridStateController;
    gridEvaluator: GridEvaluator;
}