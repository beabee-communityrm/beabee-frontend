<template>
  <div class="mb-5" :class="{ 'border-b border-primary-40 pb-3': border }">
    <div class="flex justify-between items-center">
      <AppTitle
        class="mr-4 text-primary-80"
        :class="{ 'hidden md:block': !noCollapse }"
      >
        {{ title }}
      </AppTitle>
      <slot></slot>
    </div>
    <div v-if="subTitle" class="text-sm text-primary-80">
      {{ subTitle }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import AppTitle from './AppTitle.vue';

defineProps<{
  title: string;
  subTitle?: string;
  border?: boolean;
  noCollapse?: boolean;
}>();
</script>
