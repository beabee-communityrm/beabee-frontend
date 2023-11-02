<template>
  <div class="mb-5">
    <div
      class="flex justify-between items-center"
      :class="{ 'border-b border-primary-40 pb-1': border }"
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
