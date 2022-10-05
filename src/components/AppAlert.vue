<template>
  <div class="flex items-center rounded px-4 font-semibold" :class="alertClass">
    <div v-if="slots.icon" class="flex-0 mr-4 text-lg">
      <slot name="icon" />
    </div>

    <div class="flex-1 py-4"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { useSlots } from '@vue/runtime-core';

const props = withDefaults(
  defineProps<{
    variant: 'success' | 'warning' | 'danger' | 'info';
  }>(),
  { variant: 'success' }
);

const slots = useSlots();

const alertClass = computed(() =>
  props.variant === 'info'
    ? 'bg-primary-10 text-primary'
    : `bg-${props.variant} text-white`
);
</script>
