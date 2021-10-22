<script lang="ts" setup>
import { computed } from "vue";
import { useActor } from "@xstate/vue";
import { useAppInterpreter } from "~~/composables/machine";

const { appService } = useAppInterpreter();

const { state } = useActor(appService);

const machine = computed(() => state.value.context.machine);
const machineId = computed(() => state.value.context.machineId);
</script>

<template>
  <div v-if="machine !== undefined">
    <AppVisualizer :key="machineId" :machine="machine" />
  </div>
</template>
