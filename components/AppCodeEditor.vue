<script lang="ts" setup>
import { VAceEditor } from "vue3-ace-editor";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-chrome";
import workerXmlUrl from "ace-builds/src-noconflict/worker-xml?url"; // For vite

ace.config.setModuleUrl("ace/mode/xml_worker", workerXmlUrl);

const props = defineProps<{
  code: string;
}>();

const emit = defineEmits<{
  (event: "update:code", value: string): void;
}>();
</script>

<template>
  <VAceEditor
    :value="props.code"
    lang="xml"
    :options="{
      tabSize: 2,
    }"
    @update:value="emit('update:code', $event)"
  />
</template>
