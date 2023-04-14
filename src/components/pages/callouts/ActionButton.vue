<template>
  <AppButton variant="primaryOutlined" class="lg:justify-start" :icon="icon"
    ><slot></slot
  ></AppButton>
</template>
<script lang="ts" setup>
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import AppButton from '../../button/AppButton.vue';
defineProps<{ icon: IconDefinition }>();
</script>
