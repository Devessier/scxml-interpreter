<script lang="ts" setup>
import { useAppInterpreterProvider } from "./composables/machine";
import TheEditor from "./components/TheEditor.vue";
import TheVisualizer from "./components/TheVisualizer.vue";
import GithubIcon from "./components/GithubIcon.vue";

useAppInterpreterProvider();
</script>

<template>
  <div class="grid min-h-full grid-cols-1 grid-rows-2">
    <TheEditor />

    <TheVisualizer />

    <a
      href="https://github.com/Devessier/scxml-interpreter"
      target="_blank"
      rel="nofollow noopener"
      class="absolute top-0 right-0 z-10 inline-flex items-center p-1 m-4 text-white bg-gray-800 border border-transparent rounded-md shadow-lg  hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
    >
      <span class="sr-only">scxml-interpreter on Github</span>

      <GithubIcon />
    </a>
  </div>
</template>
