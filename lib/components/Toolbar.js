import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Toolbar — add nodes, run/export the workflow.
 *
 * @module components/Toolbar
 */
import { useCanvasStore } from '../store/canvas.js';
const ADD_BUTTONS = [
    { kind: 'tool', label: '+ Tool' },
    { kind: 'agent', label: '+ Agent' },
    { kind: 'condition', label: '+ Condition' },
    { kind: 'output', label: '+ Output' },
];
export function Toolbar() {
    const addNode = useCanvasStore((s) => s.addNode);
    const toSteps = useCanvasStore((s) => s.toSteps);
    const workflowName = useCanvasStore((s) => s.workflowName);
    const setWorkflowName = useCanvasStore((s) => s.setWorkflowName);
    const dirty = useCanvasStore((s) => s.dirty);
    const onRun = () => {
        const steps = toSteps();
        // In the embedded DSH client this calls ctx.workflows.run(steps).
        // In the standalone demo we surface the generated spec.
        console.info('[dsh-workflow-canvas] steps →', JSON.stringify(steps, null, 2));
        alert('Workflow steps generated — see console (in DSH this executes via ctx.workflows).');
    };
    const onExport = () => {
        const doc = useCanvasStore.getState().exportDocument();
        const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.workflow.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "wf-toolbar", children: [_jsx("input", { className: "wf-name", value: workflowName, onChange: (e) => setWorkflowName(e.target.value), "aria-label": "Workflow name" }), _jsx("div", { className: "wf-toolbar__group", children: ADD_BUTTONS.map((b) => (_jsx("button", { className: "wf-btn", onClick: () => addNode(b.kind, b.label.slice(2), { x: 160 + Math.random() * 240, y: 120 + Math.random() * 240 }), children: b.label }, b.kind))) }), _jsxs("div", { className: "wf-toolbar__group", children: [_jsx("button", { className: "wf-btn", onClick: onExport, children: "Export" }), _jsxs("button", { className: "wf-btn wf-btn--primary", onClick: onRun, children: ["\u25B6 Run ", dirty ? '*' : ''] })] })] }));
}
