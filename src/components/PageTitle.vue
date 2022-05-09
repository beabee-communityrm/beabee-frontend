<template>
  <div class="mb-5" :class="{ 'border-primary-40 border-b pb-3': border }">
    <div class="flex justify-between">
      <h1 class="hidden font-title text-2.5xl md:block">{{ title }}</h1>
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
}>();
</script>
