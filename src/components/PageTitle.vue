<template>
  <div class="mb-5" :class="{ 'border-b border-primary-40 pb-3': border }">
    <div class="flex justify-between items-center">
      <h1
        class="mr-4 text-2.5xl font-light text-primary-80"
        :class="{ 'hidden md:block': !noCollapse }"
      >
        {{ title }}
      </h1>
      <slot></slot>
    </div>
    <div v-if="subTitle" class="text-sm text-primary-80">
      {{ subTitle }}
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  title: string;
  subTitle?: string;
  border?: boolean;
  noCollapse?: boolean;
}>();
</script>
