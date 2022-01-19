<template>
  <div
    class="flex items-center px-4 text-white font-semibold rounded"
    :class="bgColorClass"
  >
    <div v-if="slots.icon" class="mr-4 text-lg">
      <slot name="icon" />
    </div>

    <div class="py-4"><slot /></div>
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
