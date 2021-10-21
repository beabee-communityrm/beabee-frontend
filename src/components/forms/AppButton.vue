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
  variant: {
    type: String,
    default: 'primary',
  },
});

const variantStaticClasses = {
  primary: 'bg-primary-70 text-white hover:bg-primary-80',
  link: 'bg-link text-white',
  linkOutlined: 'bg-white text-link border border-link hover:bg-link-light',
  subtle:
    'bg-white text-primary-80 border border-primary-70 hover:text-primary hover:border-primary',
};

const variantClasses = computed(() => {
  return (
    variantStaticClasses[props.variant as keyof typeof variantStaticClasses] ||
    variantStaticClasses['primary']
  );
});

// - TODO: Fix this. Using scoped style didn't work on `AppLink`, also check w-full
// is necessary
const baseClasses =
  'h-10 px-2 text-center cursor-pointer flex justify-center items-center font-bold rounded w-full';

const classes = computed(() => {
  return [baseClasses, variantClasses.value, statusClasses.value];
});

const elementTypeAttribute = computed(() => {
  return props.tag === 'button' ? props.type : null;
});

const statusClasses = computed(() => {
  return props.disabled ? 'cursor-not-allowed opacity-50' : null;
});
</script>
