<template>
  <font-awesome-icon class="inline-block mr-2 h-4" :icon="icon" size="lg" />

  <span>{{ title }}</span>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: Array as () => string[],
    required: true,
  },
});
</script>
