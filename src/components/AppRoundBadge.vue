<template>
  <span
    :class="'inline-block w-2 h-2 rounded-full align-middle ' + iconColor"
  ></span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type: 'success' | 'warning' | 'error';
  }>(),
  { type: 'success' }
);

const iconColor = computed(() => `bg-${props.type}`);
</script>
