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
      :mode="mode"
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
</template>

<script lang="ts" setup>
import { watch, ref, computed, reactive } from 'vue';
import slugify from 'slugify';
import { useI18n } from 'vue-i18n';

import AppHeading from '../../../components/AppHeading.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import Stepper from '../components/Stepper.vue';
import { Steps } from '../create-callout.interface';
import { parseISO } from 'date-fns';
import router from '../../../router';
import { CreateCalloutData } from '../../../utils/api/api.interface';
import { updateCallout, createCallout } from '../../../utils/api/callout';

const { t } = useI18n();
const props = defineProps<{ steps: Steps; mode: 'edit' | 'new' }>();

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

function makeCalloutData(steps: Steps): CreateCalloutData {
  return {
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
}
async function submitForm() {
  const callout: CreateCalloutData = makeCalloutData(steps);
  const newCallout =
    props.mode === 'edit'
      ? await updateCallout(callout)
      : await createCallout(callout);
  router.push({
    path: '/admin/callouts/edit/' + newCallout.slug,
    query: { created: null },
  });
}
</script>
