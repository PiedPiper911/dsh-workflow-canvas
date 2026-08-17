# dsh-workflow-canvas 🧭

Visual workflow builder for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).
Drag and drop nodes to orchestrate **tool calls, sub-agents, and conditional branches** into a workflow that runs through DSH's `ctx.workflows` engine. Powered by [React Flow](https://github.com/xyflow/xyflow) (xyflow) and Zustand.

## Install

```sh
dsh plugin add @piedpiper911/dsh-workflow-canvas
```

## Node types

| Node | What it does |
|---|---|
| ▶ Trigger | Workflow entry point (a prompt). |
| ⚙ Tool | A single tool call (e.g. `video_frames`, `bash`). |
| 🤖 Agent | Delegate a step to a sub-agent with its own prompt. |
| ◇ Condition | Branch on an expression (then/else edges). |
| ✓ Output | Terminal result template. |

## How it works

1. Build a graph on the canvas: drag nodes from the toolbar, connect them with edges.
2. The store compiles the graph into an **ordered step list** (breadth-first from triggers, conditions become branches) — this is the exact shape DSH's workflow engine consumes.
3. `Run` hands the steps to `ctx.workflows`; `Export` saves a `.workflow.json` you can reload later.

The data model is deliberately transport-agnostic: the canvas is a *view* over a plain-JSON workflow spec, so it composes with any DSH workflow provider.

## Development

```sh
npm ci
npm run dev        # standalone demo at :5173
npm run build      # tsc + vite build
```

## License

MIT
