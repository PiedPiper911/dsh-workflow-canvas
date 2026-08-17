import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Main canvas — React Flow wrapper wiring the store to the renderer.
 *
 * @module components/Canvas
 */
import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react';
import './canvas.css';
import { useCanvasStore } from '../store/canvas.js';
import { WorkflowNodeView } from '../nodes/WorkflowNodeView.js';
import { Toolbar } from './Toolbar.js';
import { Inspector } from './Inspector.js';
import './canvas.css';
const nodeTypes = { workflow: WorkflowNodeView };
export function Canvas() {
    const nodes = useCanvasStore((s) => s.nodes);
    const edges = useCanvasStore((s) => s.edges);
    const onNodesChange = useCanvasStore((s) => s.onNodesChange);
    const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
    const onConnect = useCanvasStore((s) => s.onConnect);
    const select = useCanvasStore((s) => s.select);
    const onDrop = useCanvasStore((s) => s.select);
    return (_jsxs("div", { className: "wf-shell", children: [_jsx(Toolbar, {}), _jsxs("div", { className: "wf-main", children: [_jsx("div", { className: "wf-canvas", children: _jsxs(ReactFlow, { nodes: nodes, edges: edges, nodeTypes: nodeTypes, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onConnect: onConnect, onSelectionChange: ({ nodes: sel }) => select(sel[0]?.id ?? null), onPaneClick: () => select(null), fitView: true, proOptions: { hideAttribution: true }, children: [_jsx(Background, { variant: BackgroundVariant.Dots, gap: 18, size: 1 }), _jsx(Controls, {}), _jsx(MiniMap, { nodeColor: (n) => {
                                        const kinds = {
                                            trigger: '#10b981', tool: '#3b82f6', agent: '#8b5cf6',
                                            condition: '#f59e0b', output: '#ef4444',
                                        };
                                        return kinds[n.data?.kind ?? ''] ?? '#94a3b8';
                                    } })] }) }), _jsx(Inspector, {})] })] }));
}
