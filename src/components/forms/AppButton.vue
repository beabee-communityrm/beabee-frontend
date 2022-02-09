<template>
  <AppLink v-if="props.to" :class="classes" :to="props.to"
    ><font-awesome-icon v-if="icon" :icon="icon" class="mr-2" /><slot
  /></AppLink>

  <component
    :is="tag"
    v-else
    :disabled="disabled || loading"
    :class="classes"
    :type="elementTypeAttribute"
  >
    <font-awesome-icon v-if="icon" :icon="icon" class="mr-2" /><slot
      >Submit</slot
    >

    <font-awesome-icon
      v-if="loading"
      class="text-2xl absolute"
      :class="loadingClasses"
      :icon="['fas', 'circle-notch']"
      spin
    />
  </component>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import AppLink from '../AppLink.vue';

const variantClasses = {
  primary: ['bg-primary-70 text-white', 'hover:bg-primary-80'],
  link: ['bg-link text-white', 'hover:bg-link-110'],
  danger: ['bg-danger text-white', 'hover:bg-danger-110'],
  primaryOutlined: [
    'bg-white text-primary-80 border border-primary-70i',
    'hover:bg-primary-10 hover:text-primary hover:border-primary',
  ],
  linkOutlined: ['bg-white text-link border border-link', 'hover:bg-link-10'],
  dangerOutlined: [
    'bg-white text-danger border border-danger',
    'hover:bg-danger-10',
  ],
  text: ['underline', ''],
} as const;

const variantLoadingClasses = {
  primary: 'text-primary',
  link: 'text-link',
  danger: 'text-danger',
  primaryOutlined: 'text-primary',
  linkOutlined: 'text-link',
  dangerOutlined: 'text-danger',
  text: '',
} as const;

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    tag?: string;
    type?: string;
    to?: string;
    variant?: keyof typeof variantClasses;
    loading?: boolean;
    icon?: string;
  }>(),
  {
    disabled: false,
    tag: 'button',
    type: 'button',
    to: '',
    variant: 'primary',
    loading: false,
    icon: undefined,
  }
);

// - TODO: Fix this. Using scoped style didn't work on `AppLink`
const baseClasses =
  'h-10 px-2 text-center cursor-pointer inline-flex justify-center items-center font-bold rounded whitespace-nowrap relative';

const classes = computed(() => {
  return [
    baseClasses,
    variantClasses[props.variant][0],
    statusClasses.value,
    props.disabled ? '' : variantClasses[props.variant][1],
  ];
});

const loadingClasses = computed(() => variantLoadingClasses[props.variant]);

const elementTypeAttribute = computed(() => {
  return props.tag === 'button' ? props.type : null;
});

const statusClasses = computed(() => {
  return {
    'cursor-not-allowed opacity-50': props.disabled,
    loading: props.loading,
  };
});
</script>

<style scoped>
.loading::before {
  content: '';

  @apply absolute top-0 left-0 h-full w-full bg-white opacity-30;
}
</style>
