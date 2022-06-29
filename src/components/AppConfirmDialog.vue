<template>
  <AppModal :open="open" @close="$emit('close')">
    <header class="flex items-center justify-between mb-4">
      <h3 class="text-2xl font-semibold text-danger">
        <slot name="title" />
      </h3>
    </header>

    <div class="py-2">
      <p class="mb-4 text-lg"><slot name="text" /></p>
    </div>

    <footer class="text-center">
      <AppButton class="mr-4" variant="primaryOutlined" @click="$emit('close')"
        ><slot name="button-cancel-text"
      /></AppButton>
      <AppButton variant="danger" @click="$emit('confirm')"
        ><slot name="button-confirm-text"
      /></AppButton>
    </footer>
  </AppModal>
</template>
<script lang="ts" setup>
import AppButton from '../components/forms/AppButton.vue';
import AppModal from './AppModal.vue';

defineEmits(['close', 'confirm']);
defineProps<{ open: boolean }>();
</script>
