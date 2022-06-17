<template>
  <AppButton
    type="button"
    :variant="active ? 'primary' : 'primaryOutlined'"
    :icon="icon"
    class="mr-1 mt-1"
    size="sm"
  />
</template>

<script lang="ts" setup>
import AppButton from '../forms/AppButton.vue';

defineProps<{
  icon: string;
  active: boolean;
}>();
</script>
