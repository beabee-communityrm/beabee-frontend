<template>
  <div
    class="px-1 py-1.5 mb-2 rounded flex items-center font-semibold last:mb-0"
    :class="itemClasses"
  >
    <font-awesome-icon
      class="inline-block mr-2 h-4 fa-fw"
      :icon="icon"
      size="lg"
    />

    <span>{{ title }}</span>
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

const itemClasses = computed(
  () =>
    ((
      {
        main: [
          'text-primary-80 hover:bg-primary-5',
          'text-primary-80 bg-primary-20',
        ],
        settings: [
          'text-grey-dark hover:bg-grey-lighter',
          'bg-primary-5 text-grey-darker',
        ],
      } as const
    )[props.type][props.isActive ? 1 : 0])
);
</script>
