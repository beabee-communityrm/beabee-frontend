<template>
  <h1
    class="font-title font-semibold tracking-tight"
    :class="big ? 'md:text-5xl' : 'text-3.5xl'"
  >
    <slot />
  </h1>
</template>
<script lang="ts" setup>
defineProps<{ big?: boolean }>();
</script>
