<template>
  <CalloutSidePanel :show="!!answers" @close="$emit('close')">
    <AppHeading class="mb-4">Add a new response</AppHeading>
    <CalloutLoginPrompt v-if="showLoginPrompt" />
    <CalloutMemberOnlyPrompt v-else-if="showMemberOnlyPrompt" />
    <CalloutForm v-else-if="answers" :answers="answers" :callout="callout" />
  </CalloutSidePanel>
</template>

<script lang="ts" setup>
import { CalloutResponseAnswers } from '@beabee/beabee-common';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import CalloutForm from './CalloutForm.vue';
import CalloutMemberOnlyPrompt from './CalloutMemberOnlyPrompt.vue';
import CalloutLoginPrompt from './CalloutLoginPrompt.vue';
import { useCallout } from './use-callout';
import { toRef } from 'vue';

defineEmits<(e: 'close') => void>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  answers?: CalloutResponseAnswers;
}>();

const { showLoginPrompt, showMemberOnlyPrompt } = useCallout(
  toRef(props, 'callout')
);
</script>
