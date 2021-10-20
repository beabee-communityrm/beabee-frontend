<template>
  <app-link v-if="props.to" :class="classes" :to="props.to"><slot /></app-link>

  <component
    :is="tag"
    v-else
    :disabled="disabled"
    :class="classes"
    :type="elementTypeAttribute"
  >
    <slot>Submit</slot>
  </component>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import AppLink from '../AppLink.vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: null,
  },
  tag: {
    type: String,
    default: 'button',
  },
  type: {
    type: String,
    default: 'button',
  },
  to: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary-70',
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  // - TODO: replace this with variant if there are
  // more variants
  outlined: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: true,
  },
});

const baseClasses =
  'h-10 py-2 text-center cursor-pointer flex justify-center items-center';

const classes = computed(() => {
  return [
    baseClasses,
    dynamicClasses.value,
    colorClasses.value,
    statusClasses.value,
  ];
});

const elementTypeAttribute = computed(() => {
  return props.tag === 'button' ? props.type : null;
});

const dynamicClasses = computed(() => {
  return {
    block: props.fullWidth,
    'w-full': props.fullWidth,
    rounded: props.rounded,
  };
});

const colorClasses = computed(() => {
  const { color } = props;
  return props.outlined
    ? ['bg-white border', `text-${color}`, `border-${props.color}`]
    : [`bg-${color}`, 'text-white'];
});

const statusClasses = computed(() => {
  return props.disabled ? 'cursor-not-allowed opacity-50' : null;
});
</script>
