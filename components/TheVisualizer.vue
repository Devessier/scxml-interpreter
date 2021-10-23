<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";
import { createMachine } from "xstate";
import { useActor, useMachine } from "@xstate/vue";
import { inspect, Inspector } from "@xstate/inspect";
import { useAppInterpreter } from "~~/composables/machine";

const { appService } = useAppInterpreter();
const { state } = useActor(appService);

const machine = computed(() => state.value.context.machine);
const machineId = computed(() => state.value.context.machineId);

const inspector = ref<Inspector | undefined>(undefined);

const visualizerMachine = createMachine(
  {
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
  },
  {
    actions: {
      createInspector: () => {
        inspector.value = inspect({
          iframe: () =>
            document.querySelector("iframe#xstate") as HTMLIFrameElement,
        });
      },

      disconnectInspector: () => {
        inspector.value?.disconnect();
      },
    },
  }
);
const { send: vizSend } = useMachine(visualizerMachine);

onMounted(() => {
  vizSend({
    type: "MOUNT",
  });
});

watch(machineId, () => {
  vizSend({
    type: "CHANGE_MACHINE",
  });
});
</script>

<template>
  <iframe id="xstate" class="w-full h-full" />

  <div v-if="machine !== undefined && inspector !== undefined">
    <AppVisualizer :key="machineId" :machine="machine" />
  </div>
</template>
