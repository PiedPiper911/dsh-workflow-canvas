/**
 * Main canvas — React Flow wrapper wiring the store to the renderer.
 *
 * @module components/Canvas
 */

import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react'
import './canvas.css'
import { useCanvasStore } from '../store/canvas.js'
import { WorkflowNodeView } from '../nodes/WorkflowNodeView.js'
import { Toolbar } from './Toolbar.js'
import { Inspector } from './Inspector.js'
import './canvas.css'

const nodeTypes = { workflow: WorkflowNodeView }

export function Canvas() {
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const onNodesChange = useCanvasStore((s) => s.onNodesChange)
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange)
  const onConnect = useCanvasStore((s) => s.onConnect)
  const select = useCanvasStore((s) => s.select)
  const onDrop = useCanvasStore((s) => s.select)

  return (
    <div className="wf-shell">
      <Toolbar />
      <div className="wf-main">
        <div className="wf-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={({ nodes: sel }) => select(sel[0]?.id ?? null)}
            onPaneClick={() => select(null)}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const kinds: Record<string, string> = {
                  trigger: '#10b981', tool: '#3b82f6', agent: '#8b5cf6',
                  condition: '#f59e0b', output: '#ef4444',
                }
                return kinds[(n.data as { kind?: string })?.kind ?? ''] ?? '#94a3b8'
              }}
            />
          </ReactFlow>
        </div>
        <Inspector />
      </div>
    </div>
  )
}
