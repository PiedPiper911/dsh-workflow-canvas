/**
 * Toolbar — add nodes, run/export the workflow.
 *
 * @module components/Toolbar
 */

import { useCanvasStore } from '../store/canvas.js'
import type { WorkflowNodeType } from '../model.js'

const ADD_BUTTONS: { kind: WorkflowNodeType; label: string }[] = [
  { kind: 'tool', label: '+ Tool' },
  { kind: 'agent', label: '+ Agent' },
  { kind: 'condition', label: '+ Condition' },
  { kind: 'output', label: '+ Output' },
]

export function Toolbar() {
  const addNode = useCanvasStore((s) => s.addNode)
  const toSteps = useCanvasStore((s) => s.toSteps)
  const workflowName = useCanvasStore((s) => s.workflowName)
  const setWorkflowName = useCanvasStore((s) => s.setWorkflowName)
  const dirty = useCanvasStore((s) => s.dirty)

  const onRun = () => {
    const steps = toSteps()
    // In the embedded DSH client this calls ctx.workflows.run(steps).
    // In the standalone demo we surface the generated spec.
    console.info('[dsh-workflow-canvas] steps →', JSON.stringify(steps, null, 2))
    alert('Workflow steps generated — see console (in DSH this executes via ctx.workflows).')
  }

  const onExport = () => {
    const doc = useCanvasStore.getState().exportDocument()
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.workflow.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="wf-toolbar">
      <input
        className="wf-name"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        aria-label="Workflow name"
      />
      <div className="wf-toolbar__group">
        {ADD_BUTTONS.map((b) => (
          <button
            key={b.kind}
            className="wf-btn"
            onClick={() => addNode(b.kind, b.label.slice(2), { x: 160 + Math.random() * 240, y: 120 + Math.random() * 240 })}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="wf-toolbar__group">
        <button className="wf-btn" onClick={onExport}>
          Export
        </button>
        <button className="wf-btn wf-btn--primary" onClick={onRun}>
          ▶ Run {dirty ? '*' : ''}
        </button>
      </div>
    </div>
  )
}
