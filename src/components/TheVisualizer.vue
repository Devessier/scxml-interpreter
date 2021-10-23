<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";
import { useActor, useMachine } from "@xstate/vue";
import { inspect, Inspector } from "@xstate/inspect";
import { useAppInterpreter } from "@/composables/machine";
import AppVisualizer from "./AppVisualizer.vue";
import { visualizerMachine } from "@/machines/visualizer";

const { appService } = useAppInterpreter();
const { state } = useActor(appService);

const machine = computed(() => state.value.context.machine);
const machineId = computed(() => state.value.context.machineId);

const inspector = ref<Inspector | undefined>(undefined);

const { send: vizSend } = useMachine(visualizerMachine, {
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
});

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

  <AppVisualizer
    v-if="machine !== undefined && inspector !== undefined"
    :key="machineId"
    :machine="machine"
  />
</template>
