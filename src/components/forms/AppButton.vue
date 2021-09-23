<template>
  <button
    class="px-5 py-2 text-white rounded bg-link"
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
  return props.disabled ? 'cursor-not-allowed' : null;
});
</script>
