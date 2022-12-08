<template>
  <AppButton :loading="loading" @click="handleClick">
    <slot />
  </AppButton>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import AppButton from './AppButton.vue';

// Why does this need to be optional? Volar seems to not understand the type otherwise
const props = defineProps<{
  onClick?: (evt: Event) => Promise<void>;
}>();

const loading = ref(false);

async function handleClick(evt: Event) {
  loading.value = true;

  try {
    if (props.onClick) {
      await props.onClick(evt);
    }
  } finally {
    loading.value = false;
  }
}
</script>
