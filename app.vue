<script lang="ts" setup>
import "./assets/tailwind.css";
import { useAppInterpreterProvider } from "./composables/machine";

useAppInterpreterProvider();
</script>

<template>
  <div class="grid min-h-screen grid-cols-2 grid-rows-1">
    <TheEditor />

    <TheVisualizer />
  </div>
</template>
