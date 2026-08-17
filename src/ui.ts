/**
 * DSH web client half for dsh-workflow-canvas.
 *
 * Runs inside the sandboxed `dsh-cordis-client-runner` closure. The guarded
 * client `ctx` only exposes client-side facades (slots / theme / host / harness),
 * NOT the host-only `workflowCanvas` service — so this half is fully
 * self-contained: it renders the React Flow canvas from its own Zustand store
 * and stays mountable without waiting on any service.
 *
 * `react` / `react-dom` are externalized (resolved by the host ModuleLoader,
 * like the official dsh-client-* bundles); everything else is inlined.
 *
 * @module client
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from './components/Canvas.js'
import { useCanvasStore } from './store/canvas.js'
import rfCss from '@xyflow/react/dist/style.css'
import canvasCss from './components/canvas.css'

export const name = 'dsh-workflow-canvas-ui'
export const inject = [] as const

/** Stable mount container id; created lazily if absent from the host DOM. */
const PANEL_ID = 'dsh-workflow-canvas-panel'

function ensurePanel(): HTMLElement {
  // Inject all required styles (React Flow base + plugin theme) once.
  if (!document.getElementById('dsh-workflow-canvas-styles')) {
    const style = document.createElement('style')
    style.id = 'dsh-workflow-canvas-styles'
    style.textContent = `${rfCss}\n${canvasCss}`
    document.head.appendChild(style)
  }
  let panel = document.getElementById(PANEL_ID)
  if (!panel) {
    panel = document.createElement('div')
    panel.id = PANEL_ID
    panel.style.position = 'fixed'
    panel.style.right = '16px'
    panel.style.bottom = '16px'
    panel.style.width = 'min(70vw, 720px)'
    panel.style.height = 'min(70vh, 560px)'
    panel.style.zIndex = '100000'
    panel.style.background = '#0f172a'
    panel.style.border = '1px solid #334155'
    panel.style.borderRadius = '12px'
    panel.style.boxShadow = '0 20px 60px rgba(0,0,0,.45)'
    panel.style.overflow = 'hidden'
    panel.style.display = 'flex'
    panel.style.flexDirection = 'column'
    document.body.appendChild(panel)
  }
  return panel
}

export function apply(): () => void {
  const panel = ensurePanel()
  const root = ReactDOM.createRoot(panel)
  root.render(React.createElement(Canvas))
  return () => root.unmount()
}
