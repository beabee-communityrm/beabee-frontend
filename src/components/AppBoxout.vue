<template>
  <div class="flex gap-4 bg-white p-6 rounded items-center">
    <div class="flex-0 text-2xl self-start" :class="textColor">
      <font-awesome-icon :icon="icon" />
    </div>
    <div class="flex-1">
      <AppSubHeading :class="[textColor, { 'mb-1': $slots.default }]">
        {{ title }}
      </AppSubHeading>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import AppSubHeading from './AppSubHeading.vue';

const props = defineProps<{
  title: string;
  icon: IconDefinition;
  variant: 'success' | 'info';
}>();

const textColor = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-success';
    case 'info':
      return 'text-body-80';
    default:
      return '';
  }
});
</script>
