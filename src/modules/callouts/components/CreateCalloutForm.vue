<template>
  <div class="flex-0 basis-menu">
    <Stepper v-model="selectedStepIndex" :steps="stepsInOrder" />
  </div>
  <div class="flex-1">
    <AppHeading class="mb-5">{{ selectedStep.name }}</AppHeading>
    <component
      :is="selectedStep.component"
      v-model:data="selectedStep.data"
      v-model:validated="selectedStep.validated"
    ></component>

    <div class="flex mt-5">
      <AppButton
        variant="linkOutlined"
        :disabled="selectedStepIndex === 0"
        @click="selectedStepIndex--"
        >{{ t('createCallout.actions.back') }}</AppButton
      >
      <AppButton
        v-show="!isLastStep"
        class="ml-2"
        :disabled="!selectedStep.validated"
        @click="selectedStepIndex++"
        >{{ t('createCallout.actions.continue') }}</AppButton
      >
      <AppButton
        v-show="isLastStep"
        class="ml-2"
        :disabled="!isAllValid"
        @click="$emit('submit:modelValue')"
        >{{
          props.modelValue.dates.data.startNow
            ? t('createCallout.actions.publish')
            : t('createCallout.actions.schedule')
        }}</AppButton
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue';
import slugify from 'slugify';
import { useI18n } from 'vue-i18n';

import AppHeading from '../../../components/AppHeading.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import Stepper from '../components/Stepper.vue';
import { Steps } from '../create-callout.interface';

const { t } = useI18n();
const props = defineProps<{ modelValue: Steps }>();
const emit = defineEmits(['update:modelValue', 'submit:modelValue']);

// TODO: FIXME should just be a computed
// watch(
//   () => props.modelValue.titleAndImage.data.title,
//   (title) => {
//     props.modelValue.url.data.autoSlug = slugify(title, { lower: true });
//   }
// );

const stepsInOrder = computed(() => [
  props.modelValue.content,
  props.modelValue.titleAndImage,
  props.modelValue.visibility,
  props.modelValue.endMessage,
  props.modelValue.url,
  //props.modelValue.mailchimp,
  props.modelValue.dates,
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
