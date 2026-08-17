/**
 * A single workflow node card rendered on the canvas.
 * Kind-specific styling + inline summary of the payload.
 *
 * @module nodes/WorkflowNodeView
 */

import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNode, WorkflowNodeType } from '../model.js'

const KIND_META: Record<WorkflowNodeType, { color: string; icon: string; tag: string }> = {
  trigger: { color: '#10b981', icon: '▶', tag: 'TRIGGER' },
  tool: { color: '#3b82f6', icon: '⚙', tag: 'TOOL' },
  agent: { color: '#8b5cf6', icon: '🤖', tag: 'AGENT' },
  condition: { color: '#f59e0b', icon: '◇', tag: 'IF' },
  output: { color: '#ef4444', icon: '✓', tag: 'OUTPUT' },
}

export function WorkflowNodeView({ id, data, selected }: NodeProps<WorkflowNode>) {
  const meta = KIND_META[data.kind]
  const summary =
    data.kind === 'tool'
      ? data.tool ?? '—'
      : data.kind === 'agent'
        ? data.agent ?? '—'
        : data.kind === 'condition'
          ? data.condition ?? '—'
          : data.kind === 'output'
            ? data.template ?? '—'
            : 'entry point'

  return (
    <div
      className={`wf-node ${selected ? 'wf-node--selected' : ''}`}
      style={{ borderColor: meta.color }}
    >
      <Handle type="target" position={Position.Left} className="wf-handle" />
      <div className="wf-node__head" style={{ background: meta.color }}>
        <span className="wf-node__icon">{meta.icon}</span>
        <span className="wf-node__tag">{meta.tag}</span>
      </div>
      <div className="wf-node__body">
        <div className="wf-node__label">{data.label}</div>
        <div className="wf-node__summary">{summary}</div>
      </div>
      <Handle type="source" position={Position.Right} className="wf-handle" />
    </div>
  )
}
