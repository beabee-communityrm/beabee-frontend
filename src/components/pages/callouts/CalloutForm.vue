<template>
  <PageTitle
    :title="t(!status ? 'createCallout.title' : 'editCallout.title')"
    border
    no-collapse
  >
    <div class="flex-0 ml-3">
      <AppButton
        v-if="!status || status === ItemStatus.Draft"
        class="mr-2"
        @click="emit('saveDraft')"
      >
        {{ t('actions.saveDraft') }}
      </AppButton>
      <AppButton :disabled="!isAllValid" @click="emit('update')">
        {{
          status === ItemStatus.Open || status === ItemStatus.Ended
            ? t('actions.update')
            : isPublish
            ? t('actions.publish')
            : t('actions.schedule')
        }}
      </AppButton>
    </div>
  </PageTitle>
  <div class="flex gap-8">
    <div class="flex-0 basis-menu">
      <AppStepper v-model="selectedStepIndex" :steps="stepsInOrder" />
    </div>
    <div class="flex-1">
      <AppHeading class="mb-5">{{ selectedStep.name }}</AppHeading>
      <component
        :is="selectedStep.component"
        v-model:data="selectedStep.data"
        v-model:validated="selectedStep.validated"
        v-model:error="selectedStep.error"
        :status="status"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import { ref, computed, watch, markRaw, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../PageTitle.vue';
import AppHeading from '../../AppHeading.vue';
import AppButton from '../../forms/AppButton.vue';
import AppStepper from '../../stepper/AppStepper.vue';
import { CalloutStepsProps } from './callouts.interface';

import StepVisibility from './steps/VisibilityStep.vue';
import StepTitleAndImage from './steps/TitleAndImage.vue';
import StepEndMessage from './steps/EndMessage.vue';
// import StepMailchimpSync from './steps/MailchimpSync.vue';
import StepDatesAndDuration from './steps/DatesAndDuration.vue';
import StepContent from './steps/ContentStep.vue';

const emit = defineEmits(['saveDraft', 'update']);
const props = defineProps<{
  stepsProps: CalloutStepsProps;
  status: ItemStatus | undefined;
}>();

const { t } = useI18n();

const steps = reactive({
  content: {
    name: t('createCallout.steps.content.title'),
    description: t('createCallout.steps.content.description'),
    validated: !!props.status,
    error: false,
    component: markRaw(StepContent),
    data: props.stepsProps.content,
  },
  titleAndImage: {
    name: t('createCallout.steps.titleAndImage.title'),
    description: t('createCallout.steps.titleAndImage.description'),
    validated: !!props.status,
    error: false,
    component: markRaw(StepTitleAndImage),
    data: props.stepsProps.titleAndImage,
  },
  visibility: {
    name: t('createCallout.steps.visibility.title'),
    description: t('createCallout.steps.visibility.description'),
    validated: !!props.status,
    error: false,
    component: markRaw(StepVisibility),
    data: props.stepsProps.visibility,
  },
  endMessage: {
    name: t('createCallout.steps.endMessage.title'),
    description: t('createCallout.steps.endMessage.description'),
    validated: !!props.status,
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
    validated: !!props.status,
    error: false,
    component: markRaw(StepDatesAndDuration),
    data: props.stepsProps.dates,
  },
});

const stepsInOrder = computed(() => [
  steps.content,
  steps.titleAndImage,
  steps.visibility,
  steps.endMessage,
  //steps.mailchimp,
  steps.dates,
]);

const isPublish = ref(false);

watch(
  steps.dates.data,
  (data) => {
    isPublish.value =
      data.startNow ||
      new Date(data.startDate + 'T' + data.startTime) <= new Date();
  },
  { immediate: true }
);

const selectedStepIndex = ref(0);
const selectedStep = computed(
  () => stepsInOrder.value[selectedStepIndex.value]
);
const isAllValid = computed(() =>
  stepsInOrder.value.every((step) => step.validated)
);
</script>
