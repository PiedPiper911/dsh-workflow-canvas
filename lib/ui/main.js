import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Standalone demo entry for dsh-workflow-canvas.
 * In the DSH client this same Canvas component is mounted by the plugin;
 * here it runs standalone via Vite for development and screenshots.
 *
 * @module ui/main
 */
import { createRoot } from 'react-dom/client';
import { Canvas } from '../components/Canvas.js';
const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(_jsx(Canvas, {}));
}
