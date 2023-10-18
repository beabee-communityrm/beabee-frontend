<template>
  <CalloutSidePanel :show="!!answers" @close="$emit('close')">
    <AppHeading class="mb-4">{{ t('callout.addLocation') }}</AppHeading>
    <CalloutThanksBox v-if="showOnlyThanks" :callout="callout" />
    <template v-else>
      <CalloutLoginPrompt v-if="showLoginPrompt" />
      <CalloutMemberOnlyPrompt v-else-if="showMemberOnlyPrompt" />
      <CalloutForm
        v-else-if="answers"
        :answers="answers"
        :callout="callout"
        :style="'no-bg'"
        @submitted="handleSubmitted"
      />
    </template>
  </CalloutSidePanel>
</template>

<script lang="ts" setup>
import { CalloutResponseAnswers } from '@beabee/beabee-common';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import CalloutForm from './CalloutForm.vue';
import CalloutMemberOnlyPrompt from './CalloutMemberOnlyPrompt.vue';
import CalloutLoginPrompt from './CalloutLoginPrompt.vue';
import { useCallout } from './use-callout';
import { ref, toRef, watch } from 'vue';
import CalloutSidePanel from './CalloutSidePanel.vue';
import AppHeading from '../../AppHeading.vue';
import CalloutThanksBox from './CalloutThanksBox.vue';
import { useI18n } from 'vue-i18n';

defineEmits<(e: 'close') => void>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  answers?: CalloutResponseAnswers;
}>();

const { t } = useI18n();

const showOnlyThanks = ref(false);

const { showLoginPrompt, showMemberOnlyPrompt } = useCallout(
  toRef(props, 'callout')
);

watch(toRef(props, 'answers'), () => {
  showOnlyThanks.value = false;
});

function handleSubmitted() {
  showOnlyThanks.value = true;
}
</script>
