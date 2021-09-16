<template>
  <button
    class="px-5 py-2 text-white rounded"
    :disabled="disabled"
    :class="statusClasses"
  >
    <slot>Submit</slot>
  </button>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: true,
  },
});

const statusClasses = computed(() => {
  return props.disabled
    ? ['bg-primary-20', 'cursor-not-allowed']
    : ['bg-primary-70', 'hover:bg-primary-80'];
});
</script>
