<script lang="ts" setup>
import { watch } from "vue";
import { useMachine } from "@xstate/vue";
import { StateNode } from "xstate";

const props = defineProps<{
  machine: StateNode;
}>();

watch(
  () => props.machine,
  (machine) => console.log("machine", machine)
);

const { state } = useMachine(props.machine);
</script>

<template>
  <pre>{{ state.toJSON() }}</pre>
</template>
