export class GridEvents{
    static readonly InitialiseGridEvent: string = "GridEvent.InitialiseGrid";
    static readonly InitialiseGridCompleteEvent: string = "GridEvent.InitialiseGridComplete";
    static readonly ShowBlockSelectedEvent: string = "GridEvent.ShowBlockSelected";
    static readonly ShowBlockUnselectedEvent: string = "GridEvent.ShowBlockUnselected";
    static readonly ShowBlockSwapAnimationEvent: string = "GridEvent.ShowBlockSwapAnimation"
    static readonly SelectedBlockSwapAnimationCompleteEvent: string = "GridEvent.SelectedBlockSwapAnimationComplete";
    static readonly SwapCandidateBlockSwapAnimationCompleteEvent: string = "GridEvent.SwapCandidateBlockSwapAnimationComplete";
    static readonly BlockSwapAnimationCompleteEvent: string = "GridEvent.BlockSwapAnimationComplete";
    static readonly EvaluateGridEvent: string = "GridEvent.EvaluateGrid";
    static readonly GridEvaluationPositiveEvent: string = "GridEvent.GridEvalutationPositive";
    static readonly GridEvaluationNegativeEvent: string = "GridEvent.GridEvalutationNegative";
    static readonly BreakAndCascadeBlocksEvent: string = "GridEvent.BreakAndCascadeBlocks";
    static readonly BreakAndCascadeBlocksCompleteEvent: string = "GridEvent.BreakAndCascadeBlocksComplete";
    static readonly RefillGridEvent: string = "GridEvent.RefillGrid";
    static readonly RefillGridCompleteEvent: string = "GridEvent.RefillGridComplete";
}