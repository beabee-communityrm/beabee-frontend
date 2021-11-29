<template>
  <app-link v-if="props.to" :class="classes" :to="props.to"><slot /></app-link>

  <component
    :is="tag"
    v-else
    :disabled="disabled || loading"
    :class="classes"
    :type="elementTypeAttribute"
  >
    <slot>Submit</slot>

    <!-- only secondary buttons have loading state, that is
       why it `text-secondary` is added statically
    -->
    <FontAwesomeIcon
      v-if="loading"
      class="text-2xl absolute text-secondary"
      :icon="['fas', 'circle-notch']"
      spin
    />
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
  loading: {
    type: Boolean,
    default: false,
  },
});

const variantStaticClasses = {
  primary: 'bg-primary-70 text-white hover:bg-primary-80',
  // - TODO: remove link, to do remove it you need to change all buttons -
  link: 'bg-link text-white',
  secondary: 'bg-secondary text-white',
  // - TODO: change it to `secondaryOutlined`. Check all the places it's been used
  linkOutlined: 'bg-white text-link border border-link hover:bg-link-light',
  subtle:
    'bg-white text-primary-80 border border-primary-70 hover:text-primary hover:border-primary',
  danger: 'bg-danger-70 text-white hover:bg-danger',
  dangerOutlined:
    'bg-white text-danger border border-danger hover:bg-danger-10',
};

const variantClasses = computed(() => {
  return (
    variantStaticClasses[props.variant as keyof typeof variantStaticClasses] ||
    variantStaticClasses['primary']
  );
});

// - TODO: Fix this. Using scoped style didn't work on `AppLink`
const baseClasses =
  'h-10 px-2 text-center cursor-pointer inline-flex justify-center items-center font-bold rounded whitespace-nowrap relative';

const classes = computed(() => {
  return [baseClasses, variantClasses.value, statusClasses.value];
});

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
