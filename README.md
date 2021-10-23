# scxml-interpreter

Interpret SCXML state machines with [XState](https://github.com/statelyai/xstate) and visualize them with [@xstate/inspect](https://github.com/statelyai/xstate/tree/main/packages/xstate-inspect).

[Open interpreter :link:](https://scxml-interpreter.netlify.app)

## How to use

[Go to the online interpreter](https://scxml-interpreter.netlify.app) and paste in the editor the state machine you want to interpret. You can interact with it by using the visualizer.

## Development

If you want to launch the interpreter locally, follow those steps:

1. Clone the repository
2. Install dependencies: `yarn install`
3. Launch Vite server: `yarn dev`
4. Visit development server at [localhost:3000](http://localhost:3000)

## How it works

You write SCXML state machines with an [ace](https://ace.c9.io/) editor configured for XML language.

The SCXML state machine is transformed to a XState machine at launch and 300 milliseconds after you stopped modifying it. Then the machine is interpreted and the visualizer connects to it.
