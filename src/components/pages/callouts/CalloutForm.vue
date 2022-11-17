<template>
  <PageTitle
    :title="t(mode === 'new' ? 'createCallout.title' : 'editCallout.title')"
    border
    no-collapse
  >
    <div v-if="mode !== 'new'" class="flex-0 ml-3">
      <AppButton :disabled="!isAllValid" @click="emit('save')">{{
        t('actions.update')
      }}</AppButton>
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
        :mode="mode"
      />

      <div v-if="mode === 'new'" class="mt-5 flex">
        <AppButton
          variant="linkOutlined"
          :disabled="selectedStepIndex === 0"
          @click="selectedStepIndex--"
          >{{ t('actions.back') }}</AppButton
        >
        <AppButton
          v-show="!isLastStep"
          class="ml-2"
          :disabled="!selectedStep.validated"
          @click="selectedStepIndex++"
          >{{ t('actions.continue') }}</AppButton
        >
        <AppButton
          v-show="isLastStep"
          class="ml-2"
          :disabled="!isAllValid"
          @click="emit('save')"
          >{{
            steps.dates.data.startNow
              ? t('actions.publish')
              : t('actions.schedule')
          }}</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../PageTitle.vue';
import AppHeading from '../../AppHeading.vue';
import AppButton from '../../forms/AppButton.vue';
import AppStepper from '../../stepper/AppStepper.vue';
import { CalloutMode, CalloutSteps } from './callouts.interface';

const emit = defineEmits(['save']);
const props = defineProps<{ steps: CalloutSteps; mode: CalloutMode }>();

const { t } = useI18n();

const stepsInOrder = computed(() => [
  props.steps.content,
  props.steps.titleAndImage,
  props.steps.visibility,
  props.steps.endMessage,
  //props.steps.mailchimp,
  props.steps.dates,
]);

const selectedStepIndex = ref(0);
const selectedStep = computed(
  () => stepsInOrder.value[selectedStepIndex.value]
);
const isLastStep = computed(
  () => selectedStepIndex.value === stepsInOrder.value.length - 1
);
const isAllValid = computed(() =>
  stepsInOrder.value.every((step) => step.validated)
);
</script>
