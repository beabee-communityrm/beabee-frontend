<template>
  <header class="flex mb-4">
    <AppLogo class="w-16 flex-none self-start" />
    <div class="self-center flex flex-col ml-4">
      <h1 class="font-semibold font-title text-2xl">
        {{ title }}
      </h1>
    </div>
  </header>
</template>
<script lang="ts" setup>
import AppLogo from '../../AppLogo.vue';
defineProps<{ title: string }>();
</script>
