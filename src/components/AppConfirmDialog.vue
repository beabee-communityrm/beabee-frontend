<template>
  <AppModal
    :open="open"
    :title="title"
    :variant="variant"
    @close="$emit('close')"
  >
    <div class="mb-4 text-lg">
      <slot />
    </div>

    <footer class="text-center">
      <AppButton class="mr-4" variant="primaryOutlined" @click="$emit('close')">
        {{ cancel }}
      </AppButton>
      <AppButton :variant="variant" @click="$emit('confirm')">
        {{ confirm }}
      </AppButton>
    </footer>
  </AppModal>
</template>
<script lang="ts" setup>
import AppButton from '../components/forms/AppButton.vue';
import AppModal from './AppModal.vue';

defineEmits(['close', 'confirm']);
defineProps<{
  open: boolean;
  variant?: 'danger';
  confirm: string;
  cancel: string;
  title: string;
}>();
</script>
