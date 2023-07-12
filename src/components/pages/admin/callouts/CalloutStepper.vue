<template>
  <AppStepper v-model="selectedStepIndex" :steps="stepsInOrder" />
  <AppHeading class="mb-5">{{ selectedStep.name }}</AppHeading>
  <component
    :is="step.component"
    v-for="step in stepsInOrder"
    v-show="selectedStep === step"
    :key="step.name"
    v-model:data="step.data"
    v-model:validated="step.validated"
    v-model:error="step.error"
    :is-active="selectedStep === step"
    :status="status"
  />
</template>

<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import { ref, computed, markRaw, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../AppHeading.vue';
import AppStepper from '../../../stepper/AppStepper.vue';
import { CalloutStepsProps } from './callouts.interface';

import StepSettings from './steps/SettingsStep.vue';
import StepTitleAndImage from './steps/TitleAndImage.vue';
import StepEndMessage from './steps/EndMessage.vue';
// import StepMailchimpSync from './steps/MailchimpSync.vue';
import StepDatesAndDuration from './steps/DatesAndDuration.vue';
import StepContent from './steps/ContentStep.vue';

const props = defineProps<{
  stepsProps: CalloutStepsProps;
  status: ItemStatus | undefined;
}>();

const { t } = useI18n();

const steps = reactive({
  content: {
    name: t('createCallout.steps.content.title'),
    description: t('createCallout.steps.content.description'),
    validated: false,
    error: false,
    component: markRaw(StepContent),
    data: props.stepsProps.content,
  },
  titleAndImage: {
    name: t('createCallout.steps.titleAndImage.title'),
    description: t('createCallout.steps.titleAndImage.description'),
    validated: false,
    error: false,
    component: markRaw(StepTitleAndImage),
    data: props.stepsProps.titleAndImage,
  },
  settings: {
    name: t('createCallout.steps.settings.title'),
    description: t('createCallout.steps.settings.description'),
    validated: false,
    error: false,
    component: markRaw(StepSettings),
    data: props.stepsProps.settings,
  },
  endMessage: {
    name: t('createCallout.steps.endMessage.title'),
    description: t('createCallout.steps.endMessage.description'),
    validated: false,
    error: false,
    component: markRaw(StepEndMessage),
    data: props.stepsProps.endMessage,
  },
  /*mailchimp: {
    name: t('createCallout.steps.mailchimp.title'),
    description: t('createCallout.steps.mailchimp.description'),
    validated: !props.status,
    error: false,
    component: markRaw(StepMailchimpSync),
  },*/
  dates: {
    name: t('createCallout.steps.dates.title'),
    description: t('createCallout.steps.dates.description'),
    validated: false,
    error: false,
    component: markRaw(StepDatesAndDuration),
    data: props.stepsProps.dates,
  },
});

const stepsInOrder = [
  steps.content,
  steps.titleAndImage,
  steps.endMessage,
  steps.settings,
  //steps.mailchimp,
  steps.dates,
];
const selectedStepIndex = ref(0);
const selectedStep = computed(() => stepsInOrder[selectedStepIndex.value]);
</script>
