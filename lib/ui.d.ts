/**
 * DSH web client half for dsh-workflow-canvas.
 *
 * Runs inside the sandboxed `dsh-cordis-client-runner` closure. The guarded
 * client `ctx` only exposes client-side facades (slots / theme / host / harness),
 * NOT the host-only `workflowCanvas` service — so this half is fully
 * self-contained: it renders the React Flow canvas from its own Zustand store
 * and stays mountable without waiting on any service.
 *
 * `react` / `react-dom` are externalized (resolved by the host ModuleLoader,
 * like the official dsh-client-* bundles); everything else is inlined.
 *
 * @module client
 */
export declare const name = "dsh-workflow-canvas-ui";
export declare const inject: readonly [];
export declare function apply(): () => void;
