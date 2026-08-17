/**
 * Workflow data model for dsh-workflow-canvas.
 *
 * The model is deliberately transport-agnostic: nodes/edges serialise to a
 * plain JSON workflow that can be handed to DSH's `ctx.workflows` service, so
 * the canvas is only ever a *view* over a DSH-native workflow spec.
 *
 * @module model
 */
import type { Node, Edge } from '@xyflow/react';
/** Node kinds the canvas understands. */
export type WorkflowNodeType = 'trigger' | 'tool' | 'agent' | 'condition' | 'output';
/** Payload carried by each node — the part that maps to DSH workflow steps. */
export type WorkflowNodeData = {
    /** Node kind. */
    kind: WorkflowNodeType;
    /** User-facing label. */
    label: string;
    /** Tool name (kind === 'tool'). */
    tool?: string;
    /** Static arguments for a tool call. */
    args?: Record<string, unknown>;
    /** Sub-agent / provider id (kind === 'agent'). */
    agent?: string;
    /** Prompt for the sub-agent. */
    prompt?: string;
    /** Condition expression (kind === 'condition'). */
    condition?: string;
    /** Output template / summary (kind === 'output'). */
    template?: string;
    /** Free-form notes. */
    notes?: string;
};
/** A canvas node with our typed data payload. */
export type WorkflowNode = Node<WorkflowNodeData>;
/** A canvas edge, optionally carrying a branch label. */
export type WorkflowEdge = Edge<{
    label?: string;
}>;
/** The serialisable workflow document the canvas produces. */
export type WorkflowDocument = {
    /** Spec version for forward compat. */
    version: 1;
    name: string;
    description?: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
};
/** Validate a node payload is internally consistent. */
export declare function validateNodeData(d: WorkflowNodeData): string[];
/** Default dimensions per node kind (px). */
export declare const NODE_SIZE: Record<WorkflowNodeType, {
    width: number;
    height: number;
}>;
export declare function createNode(kind: WorkflowNodeType, label: string, position: {
    x: number;
    y: number;
}): WorkflowNode;
/**
 * Flatten a canvas workflow into an ordered step list — the bridge to DSH's
 * `ctx.workflows`. Breadth-first from every trigger; conditions become
 * conditional steps with `then`/`else` targets derived from edges.
 */
export declare function toStepList(doc: WorkflowDocument): unknown[];
