import dedent from "dedent";
import { InterpreterFrom, StateNode } from "xstate";
import { createModel } from "xstate/lib/model";
import { toMachine } from "xstate/lib/scxml";
import { nanoid } from "nanoid/non-secure";

const appModel = createModel(
  {
    scxmlMachine: dedent`
    <?xml version="1.0" ?>
    <scxml datamodel="ecmascript" name="Scxml" version="1.0" xmlns="http://www.w3.org/2005/07/scxml"><datamodel><data expr="0" id="occupancy"/></datamodel><state id="test"><state id="st1"><transition event="ev1" target="st2"/></state><state id="st2"><onentry><send event="entrySt2"/></onentry><transition event="ev2" target="st1"/></state></state></scxml>
    `,

    machine: undefined as StateNode,
    machineId: nanoid(),
  },
  {
    events: {
      SET_SCXML_MACHINE_CODE: (code: string) => ({ code }),

      RECEIVE_COMPILATION_RESULT: (machine: unknown) => ({ machine }),
    },
  }
);

const assignScxmlMachineToContext = appModel.assign(
  {
    scxmlMachine: (_, { code }) => code,
  },
  "SET_SCXML_MACHINE_CODE"
);

const assignGeneratedMachineToContext = appModel.assign(
  {
    machine: (_, { machine }) => machine as any,
    machineId: () => nanoid(),
  },
  "RECEIVE_COMPILATION_RESULT"
);

export const appMachine = appModel.createMachine(
  {
    initial: "compilingMachine",

    states: {
      editing: {
        initial: "idle",

        states: {
          idle: {},

          deboucing: {
            after: {
              300: {
                target: "debounced",
              },
            },
          },

          debounced: {
            type: "final",
          },
        },

        onDone: {
          target: "compilingMachine",
        },
      },

      compilingMachine: {
        invoke: {
          src: "compileMachine",
        },

        on: {
          RECEIVE_COMPILATION_RESULT: {
            target: "editing",

            actions: assignGeneratedMachineToContext,
          },
        },
      },
    },

    on: {
      SET_SCXML_MACHINE_CODE: {
        target: "editing.deboucing",

        actions: assignScxmlMachineToContext,
      },
    },
  },
  {
    services: {
      compileMachine:
        ({ scxmlMachine }) =>
        (sendBack) => {
          const machine = toMachine(scxmlMachine, {});

          sendBack({
            type: "RECEIVE_COMPILATION_RESULT",
            machine,
          });
        },
    },
  }
);

export type AppMachineInterpret = InterpreterFrom<typeof appMachine>;
