/**
 * Workflow data model for dsh-workflow-canvas.
 *
 * The model is deliberately transport-agnostic: nodes/edges serialise to a
 * plain JSON workflow that can be handed to DSH's `ctx.workflows` service, so
 * the canvas is only ever a *view* over a DSH-native workflow spec.
 *
 * @module model
 */
/** Validate a node payload is internally consistent. */
export function validateNodeData(d) {
    const errors = [];
    if (!d.label?.trim())
        errors.push('label required');
    if (d.kind === 'tool' && !d.tool)
        errors.push('tool node requires a tool name');
    if (d.kind === 'agent' && !d.agent)
        errors.push('agent node requires an agent id');
    if (d.kind === 'condition' && !d.condition?.trim())
        errors.push('condition node requires an expression');
    return errors;
}
/** Default dimensions per node kind (px). */
export const NODE_SIZE = {
    trigger: { width: 180, height: 56 },
    tool: { width: 220, height: 96 },
    agent: { width: 220, height: 120 },
    condition: { width: 200, height: 88 },
    output: { width: 180, height: 56 },
};
/** Fresh node factory with a stable id. */
let seq = 0;
export function createNode(kind, label, position) {
    const size = NODE_SIZE[kind];
    return {
        id: `${kind}-${++seq}-${Date.now().toString(36)}`,
        type: 'workflow',
        position,
        data: { kind, label },
        style: { width: size.width, minHeight: size.height },
    };
}
/**
 * Flatten a canvas workflow into an ordered step list — the bridge to DSH's
 * `ctx.workflows`. Breadth-first from every trigger; conditions become
 * conditional steps with `then`/`else` targets derived from edges.
 */
export function toStepList(doc) {
    const byId = new Map(doc.nodes.map((n) => [n.id, n]));
    const out = [];
    const visited = new Set();
    const emit = (id, branch) => {
        if (visited.has(id) || !byId.has(id))
            return;
        visited.add(id);
        const n = byId.get(id);
        const d = n.data;
        const step = { id: n.id, kind: d.kind, label: d.label };
        if (d.kind === 'tool') {
            step.tool = d.tool;
            step.args = d.args ?? {};
        }
        else if (d.kind === 'agent') {
            step.agent = d.agent;
            step.prompt = d.prompt;
        }
        else if (d.kind === 'condition') {
            step.condition = d.condition;
        }
        else if (d.kind === 'output') {
            step.template = d.template;
        }
        if (branch)
            step.branch = branch;
        out.push(step);
        for (const e of doc.edges) {
            if (e.source === id)
                emit(e.target, e.data?.label);
        }
    };
    for (const n of doc.nodes) {
        if (n.data.kind === 'trigger')
            emit(n.id);
    }
    return out;
}
