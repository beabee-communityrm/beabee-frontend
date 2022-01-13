<template>
  <div
    class="flex items-center h-14 px-4 text-white font-semibold rounded"
    :class="bgColorClass"
  >
    <div v-if="slots.icon" class="mr-4 text-lg">
      <slot name="icon" />
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { useSlots } from '@vue/runtime-core';

const props = withDefaults(
  defineProps<{
    variant: 'success' | 'warning' | 'danger';
  }>(),
  { variant: 'success' }
);

const slots = useSlots();

const bgColorClass = computed(() => {
  return `bg-${props.variant}`;
});
</script>
