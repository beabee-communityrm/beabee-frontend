<template>
  <CalloutSidePanel :show="true" @close="$emit('close')">
    <div class="lg:flex lg:flex-col lg:justify-center lg:items-start h-full">
      <AppTitle class="pt-8 mb-4">{{ $props.callout.title }}</AppTitle>
      <div class="mb-6 text-lg" v-html="$props.callout.intro"></div>
      <AppButton @click="$emit('close')" variant="primary" class="px-6">
        {{ t('callout.getStarted') }}
      </AppButton>
    </div>
  </CalloutSidePanel>
</template>

<script lang="ts" setup>
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import CalloutSidePanel from './CalloutSidePanel.vue';
import AppTitle from '../../AppTitle.vue';
import AppButton from '../../button/AppButton.vue';
import { useI18n } from 'vue-i18n';

defineEmits<{ (e: 'close'): void }>();
defineProps<{ callout: GetCalloutDataWith<'form'> }>();

const { t } = useI18n();
</script>
