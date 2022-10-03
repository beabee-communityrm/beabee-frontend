<template>
  <header class="mb-4 flex">
    <AppLogo class="w-16 flex-none self-start" />
    <div class="ml-4 flex flex-col self-center">
      <h1 class="font-title text-2xl font-semibold">
        {{ title }}
      </h1>
    </div>
  </header>
</template>
<script lang="ts" setup>
import AppLogo from '../../AppLogo.vue';
defineProps<{ title: string }>();
</script>
