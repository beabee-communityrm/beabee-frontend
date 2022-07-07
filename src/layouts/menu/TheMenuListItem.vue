<template>
  <div
    class="
    px-1 py-2
    my-1
    rounded
    flex
    items-center
    justify-start
    md:justify-center
    xl:justify-start
    w-auto
    md:w-12
    xl:w-auto
    md:overflow-x-hidden
    xl:overflow-auto
    font-semibold
    "
    :class="itemClass"
  >
    <font-awesome-icon
      class="inline-block h-4 fa-fw"
      :icon="icon"
      size="lg"
    />

    <span class="md:hidden xl:inline-block ml-2">{{ title }}</span>
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
  main: ['text-primary-80 hover:bg-primary-5', 'text-primary-80 bg-primary-20'],
  settings: [
    'text-grey-dark hover:bg-grey-lighter',
    'bg-primary-5 text-grey-darker',
  ],
} as const;

const itemClass = computed(
  () => itemClasses[props.type][props.isActive ? 1 : 0]
);
</script>
