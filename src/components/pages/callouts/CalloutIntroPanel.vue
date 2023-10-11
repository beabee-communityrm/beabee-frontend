<template>
  <CalloutSidePanel :show="true" @close="$emit('close')">
    <AppHeading class="mb-4">{{ $props.callout.title }}</AppHeading>
    <div v-html="$props.callout.intro"></div>
    <AppButton @click="$emit('close')">
      {{ t('callout.getStarted') }}
    </AppButton>
  </CalloutSidePanel>
</template>

<script lang="ts" setup>
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import CalloutSidePanel from './CalloutSidePanel.vue';
import AppHeading from '../../AppHeading.vue';
import AppButton from '../../button/AppButton.vue';
import { useI18n } from 'vue-i18n';

defineEmits<{ (e: 'close'): void }>();
defineProps<{ callout: GetCalloutDataWith<'form'> }>();

const { t } = useI18n();
</script>
