/**
 * Inspector panel for the selected node — edits kind-specific fields.
 *
 * @module components/Inspector
 */

import { useCanvasStore } from '../store/canvas.js'
import type { WorkflowNodeData } from '../model.js'

const KIND_LABELS: Record<WorkflowNodeData['kind'], string> = {
  trigger: 'Trigger',
  tool: 'Tool call',
  agent: 'Sub-agent',
  condition: 'Condition',
  output: 'Output',
}

export function Inspector() {
  const selectedId = useCanvasStore((s) => s.selectedId)
  const node = useCanvasStore((s) => s.nodes.find((n) => n.id === s.selectedId))
  const updateNodeData = useCanvasStore((s) => s.updateNodeData)
  const removeNode = useCanvasStore((s) => s.removeNode)

  if (!node) {
    return (
      <aside className="wf-inspector wf-inspector--empty">
        <p>Select a node to configure it.</p>
      </aside>
    )
  }
  const d = node.data

  return (
    <aside className="wf-inspector">
      <header className="wf-inspector__head">
        <strong>{KIND_LABELS[d.kind]}</strong>
        <button className="wf-btn wf-btn--danger" onClick={() => removeNode(node.id)}>
          Delete
        </button>
      </header>

      <label className="wf-field">
        <span>Label</span>
        <input
          value={d.label}
          onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
        />
      </label>

      {d.kind === 'tool' && (
        <label className="wf-field">
          <span>Tool name</span>
          <input
            placeholder="video_frames"
            value={d.tool ?? ''}
            onChange={(e) => updateNodeData(node.id, { tool: e.target.value })}
          />
        </label>
      )}

      {d.kind === 'tool' && (
        <label className="wf-field">
          <span>Args (JSON)</span>
          <textarea
            rows={4}
            placeholder='{"count": 4}'
            value={d.args ? JSON.stringify(d.args, null, 2) : ''}
            onChange={(e) => {
              try {
                updateNodeData(node.id, { args: JSON.parse(e.target.value) })
              } catch {
                /* keep old value while editing */
              }
            }}
          />
        </label>
      )}

      {d.kind === 'agent' && (
        <>
          <label className="wf-field">
            <span>Agent id</span>
            <input
              placeholder="coding-agent"
              value={d.agent ?? ''}
              onChange={(e) => updateNodeData(node.id, { agent: e.target.value })}
            />
          </label>
          <label className="wf-field">
            <span>Prompt</span>
            <textarea
              rows={3}
              value={d.prompt ?? ''}
              onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
            />
          </label>
        </>
      )}

      {d.kind === 'condition' && (
        <label className="wf-field">
          <span>Condition</span>
          <input
            placeholder="result.ok === true"
            value={d.condition ?? ''}
            onChange={(e) => updateNodeData(node.id, { condition: e.target.value })}
          />
        </label>
      )}

      {d.kind === 'output' && (
        <label className="wf-field">
          <span>Template</span>
          <textarea
            rows={3}
            value={d.template ?? ''}
            onChange={(e) => updateNodeData(node.id, { template: e.target.value })}
          />
        </label>
      )}

      <label className="wf-field">
        <span>Notes</span>
        <input
          value={d.notes ?? ''}
          onChange={(e) => updateNodeData(node.id, { notes: e.target.value })}
        />
      </label>
    </aside>
  )
}
