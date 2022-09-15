<template>
  <div class="mb-5" :class="{ 'border-primary-40 border-b pb-3': border }">
    <div class="flex justify-between">
      <h1
        class="font-title text-2.5xl"
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
