<template>
  <a v-if="href" :href="href" :class="buttonClasses">
    <font-awesome-icon v-if="icon" :icon="icon" class="mr-2" /><slot />
  </a>
  <router-link v-else-if="to" :to="to" :class="buttonClasses">
    <font-awesome-icon v-if="icon" :icon="icon" class="mr-2" /><slot />
  </router-link>

  <button
    v-else
    :disabled="disabled || loading"
    :class="buttonClasses"
    :type="type"
  >
    <font-awesome-icon v-if="icon" :icon="icon" class="mr-2" /><slot />
    <span v-if="loading" class="absolute inset-0 bg-white opacity-30" />
    <font-awesome-icon
      v-if="loading"
      class="text-2xl absolute"
      :class="loadingIconClasses"
      :icon="['fas', 'circle-notch']"
      spin
    />
  </button>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';

// Variant classes for [base, hover, loading icon]
const variantClasses = {
  primary: ['bg-primary-70 text-white', 'hover:bg-primary-80', 'text-primary'],
  link: ['bg-link text-white', 'hover:bg-link-110', 'text-link'],
  danger: ['bg-danger text-white', 'hover:bg-danger-110', 'text-danger'],
  primaryOutlined: [
    'bg-white text-primary-80 border border-primary-70',
    'hover:bg-primary-10 hover:text-primary hover:border-primary',
    'text-primary',
  ],
  linkOutlined: [
    'bg-white text-link border border-link',
    'hover:bg-link-10',
    'text-link',
  ],
  dangerOutlined: [
    'bg-white text-danger border border-danger',
    'hover:bg-danger-10',
    'text-danger',
  ],
  text: ['underline text-link', '', ''],
} as const;

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    type?: 'button' | 'submit';
    href?: string;
    to?: string;
    variant?: keyof typeof variantClasses;
    size?: 'sm';
    loading?: boolean;
    icon?: string;
  }>(),
  {
    disabled: false,
    type: 'button',
    href: undefined,
    to: undefined,
    variant: 'primary',
    size: undefined,
    loading: false,
    icon: undefined,
  }
);

const buttonClasses = computed(() => {
  return [
    'px-2 text-center cursor-pointer inline-flex justify-center items-center font-bold rounded whitespace-nowrap relative',
    props.size === 'sm' ? 'h-8 text-sm' : 'h-10',
    variantClasses[props.variant][0],
    props.disabled
      ? 'cursor-not-allowed opacity-50'
      : variantClasses[props.variant][1],
  ];
});

const loadingIconClasses = computed(() => variantClasses[props.variant][2]);
</script>
