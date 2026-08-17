/**
 * DSH plugin entry for dsh-workflow-canvas.
 *
 * Registers a self-contained `ctx.workflowCanvas` service: the canvas compiles
 * a graph into an ordered step list (plain data). It deliberately has **no hard
 * dependency on a specific workflow engine** — the host (DSH client) decides
 * how to execute the steps, so this plugin stays composable with any provider.
 *
 * @module dsh-workflow-canvas
 */
import type { Context } from '@deepseek-ai/cordis';
import type { WorkflowDocument } from './model.js';
export declare const name = "dsh-workflow-canvas";
export declare const inject: readonly [];
/** Event key emitted whenever the canvas document changes (UI → core). */
export declare const EVT_CHANGE: "workflow-canvas/change";
export type WorkflowCanvasApi = {
    /** Convert a canvas document into an ordered step list (DSH-engine-ready). */
    compile: (doc: WorkflowDocument) => unknown[];
    /** Load a document into the shared canvas store (no-op if UI absent). */
    load: (doc: WorkflowDocument) => void;
    /** Export the current canvas state (no-op when the UI is absent). */
    exportCurrent: () => WorkflowDocument | null;
};
declare module '@deepseek-ai/cordis' {
    interface Context {
        workflowCanvas: WorkflowCanvasApi;
    }
    interface Events {
        [EVT_CHANGE]: (doc: WorkflowDocument) => void;
    }
}
export declare function apply(ctx: Context): void;
/** Subscribe to canvas document changes (used by the UI bundle). */
export declare function subscribeCanvas(listener: (doc: WorkflowDocument) => void): () => void;
