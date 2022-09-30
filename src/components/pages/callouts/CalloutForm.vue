<template>
  <PageTitle
    :title="t(mode === 'new' ? 'createCallout.title' : 'editCallout.title')"
    border
    no-collapse
  >
    <div v-if="mode === 'edit'" class="flex-0 ml-3">
      <AppButton :disabled="!isAllValid" @click="submitForm">{{
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
          @click="submitForm"
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
import { watch, ref, computed, reactive } from 'vue';
import slugify from 'slugify';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../PageTitle.vue';
import AppHeading from '../../AppHeading.vue';
import AppButton from '../../forms/AppButton.vue';
import AppStepper from '../../stepper/AppStepper.vue';
import { CalloutSteps } from './callouts.interface';
import router from '../../../router';
import { UpdateCalloutData } from '../../../utils/api/api.interface';
import { updateCallout, createCallout } from '../../../utils/api/callout';

const { t } = useI18n();
const props = defineProps<{ steps: CalloutSteps; mode: 'edit' | 'new' }>();

const steps = reactive(props.steps);

// TODO: FIXME should just be a computed
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

function parseDateTime(date: string, time: string): Date {
  return new Date(date + 'T' + time);
}

function makeCalloutData(steps: CalloutSteps): [string, UpdateCalloutData] {
  return [
    steps.url.data.useCustomSlug
      ? steps.url.data.slug
      : steps.url.data.autoSlug,
    {
      title: steps.titleAndImage.data.title,
      excerpt: steps.titleAndImage.data.description,
      image: steps.titleAndImage.data.coverImageURL,
      intro: steps.content.data.introText,
      formSchema: steps.content.data.formSchema,
      starts: steps.dates.data.startNow
        ? new Date()
        : parseDateTime(steps.dates.data.startDate, steps.dates.data.startTime),
      expires: steps.dates.data.hasEndDate
        ? parseDateTime(steps.dates.data.endDate, steps.dates.data.endTime)
        : null,
      allowUpdate: steps.visibility.data.usersCanEditAnswers,
      allowMultiple: false,
      hidden: !steps.visibility.data.showOnUserDashboards,
      access:
        steps.visibility.data.whoCanTakePart === 'members'
          ? 'member'
          : steps.visibility.data.allowAnonymousResponses === 'none'
          ? 'guest'
          : steps.visibility.data.allowAnonymousResponses === 'guests'
          ? 'anonymous'
          : 'only-anonymous',
      ...(steps.endMessage.data.whenFinished === 'message'
        ? {
            thanksText: steps.endMessage.data.thankYouText,
            thanksTitle: steps.endMessage.data.thankYouTitle,
            thanksRedirect: null,
          }
        : {
            thanksText: '',
            thanksTitle: '',
            thanksRedirect: steps.endMessage.data.thankYouRedirect,
          }),
      shareTitle: steps.url.data.overrideShare ? steps.url.data.shareTitle : '',
      shareDescription: steps.url.data.overrideShare
        ? steps.url.data.shareDescription
        : '',
    },
  ];
}
async function submitForm() {
  const [slug, callout] = makeCalloutData(steps);
  const newCallout =
    props.mode === 'edit'
      ? await updateCallout(slug, callout)
      : await createCallout({ ...callout, slug });
  router.push({
    path: '/admin/callouts/view/' + newCallout.slug,
    query: {
      [props.mode === 'new' ? 'created' : 'updated']: null,
    },
  });
}
</script>
