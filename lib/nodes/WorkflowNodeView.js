import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * A single workflow node card rendered on the canvas.
 * Kind-specific styling + inline summary of the payload.
 *
 * @module nodes/WorkflowNodeView
 */
import { Handle, Position } from '@xyflow/react';
const KIND_META = {
    trigger: { color: '#10b981', icon: '▶', tag: 'TRIGGER' },
    tool: { color: '#3b82f6', icon: '⚙', tag: 'TOOL' },
    agent: { color: '#8b5cf6', icon: '🤖', tag: 'AGENT' },
    condition: { color: '#f59e0b', icon: '◇', tag: 'IF' },
    output: { color: '#ef4444', icon: '✓', tag: 'OUTPUT' },
};
export function WorkflowNodeView({ id, data, selected }) {
    const meta = KIND_META[data.kind];
    const summary = data.kind === 'tool'
        ? data.tool ?? '—'
        : data.kind === 'agent'
            ? data.agent ?? '—'
            : data.kind === 'condition'
                ? data.condition ?? '—'
                : data.kind === 'output'
                    ? data.template ?? '—'
                    : 'entry point';
    return (_jsxs("div", { className: `wf-node ${selected ? 'wf-node--selected' : ''}`, style: { borderColor: meta.color }, children: [_jsx(Handle, { type: "target", position: Position.Left, className: "wf-handle" }), _jsxs("div", { className: "wf-node__head", style: { background: meta.color }, children: [_jsx("span", { className: "wf-node__icon", children: meta.icon }), _jsx("span", { className: "wf-node__tag", children: meta.tag })] }), _jsxs("div", { className: "wf-node__body", children: [_jsx("div", { className: "wf-node__label", children: data.label }), _jsx("div", { className: "wf-node__summary", children: summary })] }), _jsx(Handle, { type: "source", position: Position.Right, className: "wf-handle" })] }));
}
