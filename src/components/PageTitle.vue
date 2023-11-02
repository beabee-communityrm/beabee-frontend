<template>
  <div>
    <div
      class="flex justify-between items-center"
      :class="{ 'has-border border-b border-primary-40 pb-3 mb-5': border }"
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
<style lang="postcss" scoped>
.has-border h1 {
  @apply mb-0;
}
</style>
