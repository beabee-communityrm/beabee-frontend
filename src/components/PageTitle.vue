<template>
  <h1 class="hidden font-title text-2xl md:block">{{ title }}</h1>
  <div v-if="subTitle" class="mb-6 text-sm text-primary-80">{{ subTitle }}</div>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    required: true,
    type: String,
  },
  subTitle: {
    default: '',
    type: String,
  },
});
</script>
