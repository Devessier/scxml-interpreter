<script lang="ts" setup>
import "./assets/tailwind.css";
import { useAppInterpreterProvider } from "./composables/machine";

useAppInterpreterProvider();
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 grid-rows-2">
    <TheEditor />

    <TheVisualizer />
  </div>
</template>
