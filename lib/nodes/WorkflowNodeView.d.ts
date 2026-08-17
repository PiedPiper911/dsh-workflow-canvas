/**
 * A single workflow node card rendered on the canvas.
 * Kind-specific styling + inline summary of the payload.
 *
 * @module nodes/WorkflowNodeView
 */
import { type NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../model.js';
export declare function WorkflowNodeView({ id, data, selected }: NodeProps<WorkflowNode>): import("react").JSX.Element;
