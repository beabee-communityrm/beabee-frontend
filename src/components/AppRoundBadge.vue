<template>
  <span
    :class="`inline-block ${iconSize} rounded-full align-middle ${iconColor}`"
  ></span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type: 'success' | 'warning' | 'error';
    size?: string;
  }>(),
  { type: 'success', size: '2' }
);

const iconSize = props.size ? ` w-${props.size} h-${props.size}` : `w-2 h-2`;
const iconColor = computed(() => `bg-${props.type}`);
</script>
