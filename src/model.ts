/**
 * Workflow data model for dsh-workflow-canvas.
 *
 * The model is deliberately transport-agnostic: nodes/edges serialise to a
 * plain JSON workflow that can be handed to DSH's `ctx.workflows` service, so
 * the canvas is only ever a *view* over a DSH-native workflow spec.
 *
 * @module model
 */

import type { Node, Edge } from '@xyflow/react'

/** Node kinds the canvas understands. */
export type WorkflowNodeType =
  | 'trigger' // entry point / prompt trigger
  | 'tool' // a single tool call
  | 'agent' // delegate to a sub-agent
  | 'condition' // conditional branch (if/else)
  | 'output' // terminal result

/** Payload carried by each node — the part that maps to DSH workflow steps. */
export type WorkflowNodeData = {
  /** Node kind. */
  kind: WorkflowNodeType
  /** User-facing label. */
  label: string
  /** Tool name (kind === 'tool'). */
  tool?: string
  /** Static arguments for a tool call. */
  args?: Record<string, unknown>
  /** Sub-agent / provider id (kind === 'agent'). */
  agent?: string
  /** Prompt for the sub-agent. */
  prompt?: string
  /** Condition expression (kind === 'condition'). */
  condition?: string
  /** Output template / summary (kind === 'output'). */
  template?: string
  /** Free-form notes. */
  notes?: string
}

/** A canvas node with our typed data payload. */
export type WorkflowNode = Node<WorkflowNodeData>

/** A canvas edge, optionally carrying a branch label. */
export type WorkflowEdge = Edge<{ label?: string }>

/** The serialisable workflow document the canvas produces. */
export type WorkflowDocument = {
  /** Spec version for forward compat. */
  version: 1
  name: string
  description?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

/** Validate a node payload is internally consistent. */
export function validateNodeData(d: WorkflowNodeData): string[] {
  const errors: string[] = []
  if (!d.label?.trim()) errors.push('label required')
  if (d.kind === 'tool' && !d.tool) errors.push('tool node requires a tool name')
  if (d.kind === 'agent' && !d.agent) errors.push('agent node requires an agent id')
  if (d.kind === 'condition' && !d.condition?.trim()) errors.push('condition node requires an expression')
  return errors
}

/** Default dimensions per node kind (px). */
export const NODE_SIZE: Record<WorkflowNodeType, { width: number; height: number }> = {
  trigger: { width: 180, height: 56 },
  tool: { width: 220, height: 96 },
  agent: { width: 220, height: 120 },
  condition: { width: 200, height: 88 },
  output: { width: 180, height: 56 },
}

/** Fresh node factory with a stable id. */
let seq = 0
export function createNode(kind: WorkflowNodeType, label: string, position: { x: number; y: number }): WorkflowNode {
  const size = NODE_SIZE[kind]
  return {
    id: `${kind}-${++seq}-${Date.now().toString(36)}`,
    type: 'workflow',
    position,
    data: { kind, label },
    style: { width: size.width, minHeight: size.height },
  }
}

/**
 * Flatten a canvas workflow into an ordered step list — the bridge to DSH's
 * `ctx.workflows`. Breadth-first from every trigger; conditions become
 * conditional steps with `then`/`else` targets derived from edges.
 */
export function toStepList(doc: WorkflowDocument): unknown[] {
  const byId = new Map(doc.nodes.map((n) => [n.id, n]))
  const out: unknown[] = []
  const visited = new Set<string>()

  const emit = (id: string, branch?: string): void => {
    if (visited.has(id) || !byId.has(id)) return
    visited.add(id)
    const n = byId.get(id)!
    const d = n.data
    const step: Record<string, unknown> = { id: n.id, kind: d.kind, label: d.label }
    if (d.kind === 'tool') {
      step.tool = d.tool
      step.args = d.args ?? {}
    } else if (d.kind === 'agent') {
      step.agent = d.agent
      step.prompt = d.prompt
    } else if (d.kind === 'condition') {
      step.condition = d.condition
    } else if (d.kind === 'output') {
      step.template = d.template
    }
    if (branch) step.branch = branch
    out.push(step)
    for (const e of doc.edges) {
      if (e.source === id) emit(e.target, e.data?.label)
    }
  }

  for (const n of doc.nodes) {
    if (n.data.kind === 'trigger') emit(n.id)
  }
  return out
}
