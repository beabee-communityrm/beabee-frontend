<template>
  <div class="flex h-8 items-center mb-6 md:hidden">
    <span class="h-px flex-grow bg-primary-20" />
    <h2
      class="text-sm text-primary-40 font-semibold uppercase text-center px-3"
    >
      <slot />
    </h2>
    <span class="h-px flex-grow bg-primary-20" />
  </div>
  <AppHeading class="mb-2 hidden md:block"><slot /></AppHeading>
</template>
<script lang="ts" setup>
import AppHeading from '../../../components/AppHeading.vue';
</script>
