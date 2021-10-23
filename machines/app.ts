import dedent from "dedent";
import { InterpreterFrom, StateNode } from "xstate";
import { createModel } from "xstate/lib/model";
import { toMachine } from "xstate/lib/scxml";
import { nanoid } from "nanoid/non-secure";

const appModel = createModel(
  {
    scxmlMachine: dedent`
    <?xml version="1.0"?>
<scxml xmlns="http://www.w3.org/2005/07/scxml"
       version="1.0"
       datamodel="ecmascript"
       initial="off">

  <!--  trivial 5 second microwave oven example -->
  <datamodel>
    <data id="cook_time" expr="5"/>
    <data id="door_closed" expr="true"/>
    <data id="timer" expr="0"/>
  </datamodel>

  <state id="off">
    <!-- off state -->
    <transition event="turn.on" target="on"/>
  </state>

  <state id="on">
    <initial>
        <transition target="idle"/>
    </initial>
    <!-- on/pause state -->

    <transition event="turn.off" target="off"/>
    <transition cond="timer &gt;= cook_time" target="off"/>

    <state id="idle">
      <!-- default immediate transition if door is shut -->
      <transition cond="door_closed" target="cooking"/>
      <transition event="door.close" target="cooking">
        <assign location="door_closed" expr="true"/>
        <!-- start cooking -->
      </transition>
    </state>

    <state id="cooking">
      <transition event="door.open" target="idle">
        <assign location="door_closed" expr="false"/>
      </transition>

      <!-- a 'time' event is seen once a second -->
      <transition event="time">
        <assign location="timer" expr="timer + 1"/>
      </transition>
    </state>

  </state>

</scxml>
    `,

    machine: undefined as StateNode | undefined,
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
