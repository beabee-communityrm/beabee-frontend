<template>
  <h1
    class="font-title text-3.5xl tracking-tight mb-3"
    :class="[big && 'md:text-5xl', light ? 'font-light' : 'font-semibold']"
  >
    <slot />
  </h1>
</template>
<script lang="ts" setup>
defineProps<{ big?: boolean; light?: boolean }>();
</script>
