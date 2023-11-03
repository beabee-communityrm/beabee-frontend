<template>
  <div
    class="flex justify-between items-center"
    :class="{ 'border-b border-primary-40 mb-5': border }"
  >
    <AppTitle
      light
      class="mr-4 text-primary-80"
      :class="{ 'hidden md:block': !noCollapse }"
    >
      {{ title }}
    </AppTitle>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import AppTitle from './AppTitle.vue';

defineProps<{
  title: string;
  border?: boolean;
  noCollapse?: boolean;
}>();
</script>
