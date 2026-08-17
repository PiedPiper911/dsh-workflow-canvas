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
import { toStepList } from './model.js';
export const name = 'dsh-workflow-canvas';
export const inject = [];
/** Event key emitted whenever the canvas document changes (UI → core). */
export const EVT_CHANGE = 'workflow-canvas/change';
/** Reactive document store shared between core and UI (framework-free). */
const listeners = new Set();
export function apply(ctx) {
    ctx.provide('workflowCanvas', {
        compile: (doc) => toStepList(doc),
        load: (doc) => {
            for (const fn of listeners)
                fn(doc);
        },
        exportCurrent: () => null,
    });
    // Core listens for canvas changes coming from the UI bundle.
    ctx.on(EVT_CHANGE, (doc) => {
        for (const fn of listeners)
            fn(doc);
    });
}
/** Subscribe to canvas document changes (used by the UI bundle). */
export function subscribeCanvas(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
