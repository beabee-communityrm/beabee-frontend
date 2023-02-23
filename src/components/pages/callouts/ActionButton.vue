<template>
  <AppButton variant="primaryOutlined" class="lg:justify-start" :icon="icon"
    ><slot></slot
  ></AppButton>
</template>
<script lang="ts" setup>
import AppButton from '../../button/AppButton.vue';

defineProps<{
  icon: string;
}>();
</script>
