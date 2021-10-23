import { createModel } from "xstate/lib/model";

const visualizerModel = createModel(
  {},
  {
    events: {
      MOUNT: () => ({}),

      CHANGE_MACHINE: () => ({}),
    },
  }
);

export const visualizerMachine = visualizerModel.createMachine({
  initial: "init",

  states: {
    init: {
      on: {
        MOUNT: {
          target: "mounted",
        },
      },
    },

    mounted: {
      entry: "createInspector",

      exit: "disconnectInspector",
    },
  },

  on: {
    CHANGE_MACHINE: {
      target: "mounted",
    },
  },
});
