<template>
  <CalloutSidePanel :show="show" @close="$emit('close')">
    <div class="lg:flex lg:flex-col lg:justify-center lg:items-start h-full">
      <AppTitle class="pt-8 mb-4">{{ callout.title }}</AppTitle>
      <figure class="mb-6">
        <img class="w-full object-cover" :src="callout.image" />
      </figure>
      <div class="mb-6 text-lg" v-html="callout.intro"></div>
      <AppButton variant="primary" class="px-6" @click="$emit('close')">
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
defineProps<{ callout: GetCalloutDataWith<'form'>; show: boolean }>();

const { t } = useI18n();
</script>
