<template>
  <AppButton :loading="loading" @click="handleClick">
    <slot />
  </AppButton>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps<{
  onClick?: (evt: Event) => Promise<void>;
}>();

const loading = ref(false);

async function handleClick(evt: Event) {
  loading.value = true;
  try {
    props.onClick?.(evt);
  } finally {
    loading.value = false;
  }
}
</script>
