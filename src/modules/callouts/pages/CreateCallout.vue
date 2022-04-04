<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle :title="t('createCallout.title')" />
  </div>
  <div class="flex gap-8">
    <div class="flex-0 basis-[240px]">
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
          :disabled="selectedStep === stepsInOrder[0]"
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
          @click="submitForm"
          >{{
            steps.dates.data.startNow
              ? t('createCallout.actions.publish')
              : t('createCallout.actions.schedule')
          }}</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, markRaw } from 'vue';
import { createCallout } from '../../../utils/api/callout';
import type { CreateCalloutData } from '../../../utils/api/api.interface';
import Stepper from '../components/Stepper.vue';
import Visibility from '../components/Visibility.vue';
import TitleAndImage from '../components/TitleAndImage.vue';
import EndMessage from '../components/EndMessage.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import UrlAndSharing from '../components/UrlAndSharing.vue';
import MailchimpSync from '../components/MailchimpSync.vue';
import DatesAndDurationVue from '../components/DatesAndDuration.vue';
import ContentStep from '../components/ContentStep.vue';
import { Steps } from '../create-callout.interface';
import PageTitle from '../../../components/PageTitle.vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';

const { t } = useI18n();

const steps: Steps = reactive({
  content: {
    name: t('createCallout.steps.content.title'),
    description: t('createCallout.steps.content.description'),
    validated: false,
    component: markRaw(ContentStep),
    data: { introText: '', formSchema: { components: [] } },
  },
  titleAndImage: {
    name: t('createCallout.steps.titleAndImage.title'),
    description: t('createCallout.steps.titleAndImage.description'),
    validated: false,
    component: markRaw(TitleAndImage),
    data: { title: '', description: '', coverImageURL: '' },
  },
  visibility: {
    name: t('createCallout.steps.visibility.title'),
    description: t('createCallout.steps.visibility.description'),
    validated: false,
    component: markRaw(Visibility),
    data: {
      whoCanTakePart: 'members',
      allowAnonymousResponses: false,
      showOnUserDashboards: true,
      usersCanEditAnswers: false,
    },
  },
  endMessage: {
    name: 'End message',
    description: 'Set a final thank you message or page to redirect',
    validated: false,
    component: markRaw(EndMessage),
    data: {
      whenFinished: 'message',
      thankYouTitle: '',
      thankYouText: '',
      URLRedirect: '',
    },
  },
  url: {
    name: t('createCallout.steps.url.title'),
    description: t('createCallout.steps.url.description'),
    validated: false,
    component: markRaw(UrlAndSharing),
    data: {
      slug: '',
      metaTitle: '',
      metaDescription: '',
    },
  },
  mailchimp: {
    name: t('createCallout.steps.mailchimp.title'),
    description: t('createCallout.steps.mailchimp.description'),
    validated: false,
    component: markRaw(MailchimpSync),
    data: {
      useMailchimpSync: false,
    },
  },
  dates: {
    name: t('createCallout.steps.dates.title'),
    description: t('createCallout.steps.dates.description'),
    validated: false,
    component: markRaw(DatesAndDurationVue),
    data: {
      startNow: true,
      hasEndDate: false,
      startDate: '',
      endDate: '',
    },
  },
});

const stepsInOrder = computed(() => [
  steps.content,
  steps.titleAndImage,
  steps.visibility,
  steps.endMessage,
  steps.url,
  steps.mailchimp,
  steps.dates,
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

const makeCalloutData = (creationData: Steps): CreateCalloutData => ({
  // slug: creationData.find(e => e.name === "URL and sharing")?.data.slug,
  slug: '',
  title: '',
  intro: '',
  formSchema: { components: [] },
  excerpt: '',
  access: 'member',
  allowUpdate: true,
  allowMultiple: true,
  image: 'string',
  starts: new Date(),
  expires: new Date(),
});

const submitForm = () => {
  createCallout(makeCalloutData(steps));
};
</script>
