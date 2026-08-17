/**
 * Zustand store for the canvas — nodes, edges, selection, and the bridge to
 * DSH's `ctx.workflows` service. Kept framework-agnostic so the same store can
 * back both the standalone demo UI and the embedded DSH client plugin.
 *
 * @module store
 */
import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { createNode, toStepList } from '../model.js';
export const useCanvasStore = create((set, get) => ({
    nodes: [
        {
            id: 'trigger-1',
            type: 'workflow',
            position: { x: 80, y: 200 },
            data: { kind: 'trigger', label: 'Start' },
            style: { width: 180 },
        },
    ],
    edges: [],
    selectedId: null,
    workflowName: 'Untitled workflow',
    dirty: false,
    onNodesChange: (changes) => set((s) => ({ nodes: applyNodeChanges(changes, s.nodes), dirty: true })),
    onEdgesChange: (changes) => set((s) => ({ edges: applyEdgeChanges(changes, s.edges), dirty: true })),
    onConnect: (conn) => set((s) => ({ edges: addEdge({ ...conn, data: { label: undefined } }, s.edges), dirty: true })),
    addNode: (kind, label, position) => {
        const n = createNode(kind, label, position);
        set((s) => ({ nodes: [...s.nodes, n], selectedId: n.id, dirty: true }));
        return n.id;
    },
    updateNodeData: (id, patch) => set((s) => ({
        nodes: s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
        dirty: true,
    })),
    removeNode: (id) => set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== id),
        edges: s.edges.filter((e) => e.source !== id && e.target !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
        dirty: true,
    })),
    select: (id) => set({ selectedId: id }),
    setWorkflowName: (name) => set({ workflowName: name, dirty: true }),
    exportDocument: () => ({
        version: 1,
        name: get().workflowName,
        nodes: get().nodes,
        edges: get().edges,
    }),
    toSteps: () => toStepList(get().exportDocument()),
    importDocument: (doc) => set({ nodes: doc.nodes, edges: doc.edges, workflowName: doc.name, dirty: false }),
    reset: () => set({
        nodes: [createNode('trigger', 'Start', { x: 80, y: 200 })],
        edges: [],
        selectedId: null,
        workflowName: 'Untitled workflow',
        dirty: false,
    }),
}));
