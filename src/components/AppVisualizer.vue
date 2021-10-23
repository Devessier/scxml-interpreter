<script lang="ts" setup>
import { useMachine } from "@xstate/vue";
import { StateNode } from "xstate";

const props = defineProps<{
  machine: StateNode;
}>();

useMachine(props.machine, { devTools: true });
</script>
