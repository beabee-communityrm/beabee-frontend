<template>
  <h1
    class="font-title tracking-tight mb-3"
    :class="[
      big ? 'text-3.5xl md:text-5xl' : 'text-3.5xl',
      light ? 'font-light' : 'font-semibold',
    ]"
  >
    <slot />
  </h1>
</template>
<script lang="ts" setup>
defineProps<{ big?: boolean; light?: boolean }>();
</script>
