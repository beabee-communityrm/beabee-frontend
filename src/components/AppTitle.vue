<template>
  <h1
    class="mb-3 font-title text-3.5xl/tight"
    :class="[
      big && 'md:text-5xl/tight',
      light ? 'font-light' : 'font-semibold',
    ]"
  >
    <slot />
  </h1>
</template>
<script lang="ts" setup>
defineProps<{ big?: boolean; light?: boolean }>();
</script>
