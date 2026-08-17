import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Inspector panel for the selected node — edits kind-specific fields.
 *
 * @module components/Inspector
 */
import { useCanvasStore } from '../store/canvas.js';
const KIND_LABELS = {
    trigger: 'Trigger',
    tool: 'Tool call',
    agent: 'Sub-agent',
    condition: 'Condition',
    output: 'Output',
};
export function Inspector() {
    const selectedId = useCanvasStore((s) => s.selectedId);
    const node = useCanvasStore((s) => s.nodes.find((n) => n.id === s.selectedId));
    const updateNodeData = useCanvasStore((s) => s.updateNodeData);
    const removeNode = useCanvasStore((s) => s.removeNode);
    if (!node) {
        return (_jsx("aside", { className: "wf-inspector wf-inspector--empty", children: _jsx("p", { children: "Select a node to configure it." }) }));
    }
    const d = node.data;
    return (_jsxs("aside", { className: "wf-inspector", children: [_jsxs("header", { className: "wf-inspector__head", children: [_jsx("strong", { children: KIND_LABELS[d.kind] }), _jsx("button", { className: "wf-btn wf-btn--danger", onClick: () => removeNode(node.id), children: "Delete" })] }), _jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Label" }), _jsx("input", { value: d.label, onChange: (e) => updateNodeData(node.id, { label: e.target.value }) })] }), d.kind === 'tool' && (_jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Tool name" }), _jsx("input", { placeholder: "video_frames", value: d.tool ?? '', onChange: (e) => updateNodeData(node.id, { tool: e.target.value }) })] })), d.kind === 'tool' && (_jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Args (JSON)" }), _jsx("textarea", { rows: 4, placeholder: '{"count": 4}', value: d.args ? JSON.stringify(d.args, null, 2) : '', onChange: (e) => {
                            try {
                                updateNodeData(node.id, { args: JSON.parse(e.target.value) });
                            }
                            catch {
                                /* keep old value while editing */
                            }
                        } })] })), d.kind === 'agent' && (_jsxs(_Fragment, { children: [_jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Agent id" }), _jsx("input", { placeholder: "coding-agent", value: d.agent ?? '', onChange: (e) => updateNodeData(node.id, { agent: e.target.value }) })] }), _jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Prompt" }), _jsx("textarea", { rows: 3, value: d.prompt ?? '', onChange: (e) => updateNodeData(node.id, { prompt: e.target.value }) })] })] })), d.kind === 'condition' && (_jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Condition" }), _jsx("input", { placeholder: "result.ok === true", value: d.condition ?? '', onChange: (e) => updateNodeData(node.id, { condition: e.target.value }) })] })), d.kind === 'output' && (_jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Template" }), _jsx("textarea", { rows: 3, value: d.template ?? '', onChange: (e) => updateNodeData(node.id, { template: e.target.value }) })] })), _jsxs("label", { className: "wf-field", children: [_jsx("span", { children: "Notes" }), _jsx("input", { value: d.notes ?? '', onChange: (e) => updateNodeData(node.id, { notes: e.target.value }) })] })] }));
}
