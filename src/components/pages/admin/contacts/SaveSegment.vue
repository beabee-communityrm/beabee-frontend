<template>
  <AppButton
    variant="link"
    size="xs"
    icon="floppy-disk"
    @click="showModal = true"
  >
    Save segment
  </AppButton>
  <AppModal :open="showModal" @close="showModal = false">
    You want to save this?
  </AppModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AppModal from '../../../AppModal.vue';
import AppButton from '../../../forms/AppButton.vue';

const showModal = ref(false);
</script>
