<template>
  <div
    class="my-0.5 flex w-auto items-center justify-start rounded px-1 py-2 font-semibold md:w-12 md:justify-center md:overflow-x-hidden xl:w-auto xl:justify-start xl:overflow-auto"
    :class="itemClass"
  >
    <font-awesome-icon class="fa-fw inline-block h-4" :icon="icon" size="lg" />

    <span class="ml-2 md:hidden xl:inline-block">{{ title }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    icon: [string, string];
    type?: 'main' | 'settings';
    isActive?: boolean;
  }>(),
  {
    type: 'main',
  }
);

// Different nav item styles: tuple is [normal, active] classes
const itemClasses = {
  main: ['text-body-80 hover:bg-primary-5', 'text-body-80 bg-primary-20'],
  settings: [
    'text-grey-dark hover:bg-grey-lighter',
    'bg-primary-5 text-grey-darker',
  ],
} as const;

const itemClass = computed(
  () => itemClasses[props.type][props.isActive ? 1 : 0]
);
</script>
