<script lang="ts" setup>
import { computed } from "vue";
import { useActor } from "@xstate/vue";
import { useAppInterpreter } from "@/composables/machine";
import AppCodeEditor from "./AppCodeEditor.vue";

const { appService } = useAppInterpreter();

const { state, send } = useActor(appService);

const code = computed(() => state.value.context.scxmlMachine);

function handleCodeUpdate(code: string) {
  send({
    type: "SET_SCXML_MACHINE_CODE",
    code,
  });
}
</script>

<template>
  <AppCodeEditor
    :code="code"
    class="flex-grow shadow"
    @update:code="handleCodeUpdate"
  />
</template>
