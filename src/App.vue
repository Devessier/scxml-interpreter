<script lang="ts" setup>
import { useAppInterpreterProvider } from "./composables/machine";
import TheEditor from "./components/TheEditor.vue";
import TheVisualizer from "./components/TheVisualizer.vue";

useAppInterpreterProvider();
</script>

<template>
  <div class="grid min-h-full grid-cols-1 grid-rows-2">
    <TheEditor />

    <TheVisualizer />
  </div>
</template>
