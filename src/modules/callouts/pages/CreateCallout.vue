<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle :title="t('createCallout.title')" />
  </div>
  <div class="flex gap-8">
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
import { parseISO } from 'date-fns';
import slugify from 'slugify';
import { reactive, ref, computed, markRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { createCallout } from '../../../utils/api/callout';
import type { CreateCalloutData } from '../../../utils/api/api.interface';
import PageTitle from '../../../components/PageTitle.vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import Stepper from '../components/Stepper.vue';
import StepVisibility from '../components/steps/Visibility.vue';
import StepTitleAndImage from '../components/steps/TitleAndImage.vue';
import StepEndMessage from '../components/steps/EndMessage.vue';
import StepUrlAndSharing from '../components/steps/UrlAndSharing.vue';
import StepMailchimpSync from '../components/steps/MailchimpSync.vue';
import StepDatesAndDuration from '../components/steps/DatesAndDuration.vue';
import StepContent from '../components/steps/Content.vue';
import { Steps } from '../create-callout.interface';

const { t } = useI18n();

const router = useRouter();

const steps: Steps = reactive({
  content: {
    name: t('createCallout.steps.content.title'),
    description: t('createCallout.steps.content.description'),
    validated: false,
    component: markRaw(StepContent),
    data: { introText: '', formSchema: { components: [] } },
  },
  titleAndImage: {
    name: t('createCallout.steps.titleAndImage.title'),
    description: t('createCallout.steps.titleAndImage.description'),
    validated: false,
    component: markRaw(StepTitleAndImage),
    data: { title: '', description: '', coverImageURL: '' },
  },
  visibility: {
    name: t('createCallout.steps.visibility.title'),
    description: t('createCallout.steps.visibility.description'),
    validated: false,
    component: markRaw(StepVisibility),
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
    component: markRaw(StepEndMessage),
    data: {
      whenFinished: 'message',
      thankYouTitle: '',
      thankYouText: '',
      thankYouRedirect: '',
    },
  },
  url: {
    name: t('createCallout.steps.url.title'),
    description: t('createCallout.steps.url.description'),
    validated: false,
    component: markRaw(StepUrlAndSharing),
    data: {
      useCustomSlug: false,
      autoSlug: '',
      slug: '',
      overrideShare: false,
      shareTitle: '',
      shareDescription: '',
    },
  },
  /*mailchimp: {
    name: t('createCallout.steps.mailchimp.title'),
    description: t('createCallout.steps.mailchimp.description'),
    validated: false,
    component: markRaw(StepMailchimpSync),
    data: {
      useMailchimpSync: false,
    },
  },*/
  dates: {
    name: t('createCallout.steps.dates.title'),
    description: t('createCallout.steps.dates.description'),
    validated: false,
    component: markRaw(StepDatesAndDuration),
    data: {
      startNow: true,
      hasEndDate: false,
      startDate: '',
      endDate: '',
    },
  },
});

// TODO: should just be a computed
watch(
  () => steps.titleAndImage.data.title,
  (title) => {
    steps.url.data.autoSlug = slugify(title, { lower: true });
  }
);

const stepsInOrder = computed(() => [
  steps.content,
  steps.titleAndImage,
  steps.visibility,
  steps.endMessage,
  steps.url,
  //steps.mailchimp,
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

async function submitForm() {
  const callout: CreateCalloutData = {
    slug: steps.url.data.useCustomSlug
      ? steps.url.data.slug
      : steps.url.data.autoSlug,
    title: steps.titleAndImage.data.title,
    excerpt: steps.titleAndImage.data.description,
    image: steps.titleAndImage.data.coverImageURL,
    intro: steps.content.data.introText,
    formSchema: steps.content.data.formSchema,
    starts: steps.dates.data.startNow
      ? new Date()
      : parseISO(steps.dates.data.startDate),
    ...(steps.dates.data.hasEndDate && {
      expires: parseISO(steps.dates.data.endDate),
    }),
    allowUpdate: steps.visibility.data.usersCanEditAnswers,
    allowMultiple: false,
    hidden: !steps.visibility.data.showOnUserDashboards,
    access:
      steps.visibility.data.whoCanTakePart === 'members'
        ? 'member'
        : steps.visibility.data.allowAnonymousResponses
        ? 'anonymous'
        : 'guest',
    ...(steps.endMessage.data.whenFinished === 'message'
      ? {
          thanksText: steps.endMessage.data.thankYouText,
          thanksTitle: steps.endMessage.data.thankYouTitle,
        }
      : {
          thanksText: '',
          thanksTitle: '',
          thanksRedirect: steps.endMessage.data.thankYouRedirect,
        }),
  };

  const newCallout = await createCallout(callout);
  router.push({
    path: '/admin/callouts/edit/' + newCallout.slug,
    query: { created: null },
  });
}
</script>
