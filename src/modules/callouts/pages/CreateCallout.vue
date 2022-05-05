<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle v-if="mode === 'new'" :title="t('createCallout.title')" />
    <PageTitle
      v-if="mode === 'edit'"
      :title="t('editCallout.title')"
      subTitle="Warning!"
    />
  </div>
  <WarningBanner v-if="mode === 'edit'" />
  <div class="flex gap-8">
    <CreateCalloutForm
      v-if="steps"
      v-model="steps"
      @submit:modelValue="submitForm()"
    />
  </div>
</template>

<script lang="ts" setup>
import { parseISO } from 'date-fns';
import { ref, markRaw, onBeforeMount, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import {
  createCallout,
  editCallout,
  fetchCallout,
} from '../../../utils/api/callout';
import type {
  CreateCalloutData,
  GetMoreCalloutData,
} from '../../../utils/api/api.interface';
import PageTitle from '../../../components/PageTitle.vue';

import StepVisibility from '../components/steps/Visibility.vue';
import StepTitleAndImage from '../components/steps/TitleAndImage.vue';
import StepEndMessage from '../components/steps/EndMessage.vue';
import StepUrlAndSharing from '../components/steps/UrlAndSharing.vue';
// import StepMailchimpSync from '../components/steps/MailchimpSync.vue';
import StepDatesAndDuration from '../components/steps/DatesAndDuration.vue';
import StepContent from '../components/steps/Content.vue';
import { Steps } from '../create-callout.interface';
import CreateCalloutForm from '../components/CreateCalloutForm.vue';
import WarningBanner from '../components/WarningBanner.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const steps: Ref<null | Steps> = ref(null);
const mode = route.path.split('/')[3];

const makeCalloutData = (steps: Steps): CreateCalloutData => ({
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
});
const makeStepsData = (data: GetMoreCalloutData): Steps => ({
  content: {
    name: t('createCallout.steps.content.title'),
    description: t('createCallout.steps.content.description'),
    validated: data.intro ? true : false,
    component: markRaw(StepContent),
    data: {
      introText: data.intro || '',
      formSchema: data.formSchema || { components: [] },
    },
  },
  titleAndImage: {
    name: t('createCallout.steps.titleAndImage.title'),
    description: t('createCallout.steps.titleAndImage.description'),
    validated: data.intro ? true : false,
    component: markRaw(StepTitleAndImage),
    data: {
      title: data.title || '',
      description: data.excerpt || '',
      coverImageURL: data.image || '',
    },
  },
  visibility: {
    name: t('createCallout.steps.visibility.title'),
    description: t('createCallout.steps.visibility.description'),
    validated: data.intro ? true : false,
    component: markRaw(StepVisibility),
    data: {
      whoCanTakePart: data.access
        ? data.access === 'member'
          ? 'members'
          : 'everyone'
        : 'members',
      allowAnonymousResponses: data.access
        ? data.access === 'anonymous'
          ? true
          : false
        : false,
      showOnUserDashboards: data.hidden || false,
      usersCanEditAnswers: data.allowUpdate || false,
    },
  },
  endMessage: {
    name: 'End message',
    description: 'Set a final thank you message or page to redirect',
    validated: data.intro ? true : false,
    component: markRaw(StepEndMessage),
    data: {
      whenFinished: 'message',
      thankYouTitle: data.thanksTitle ? data.thanksTitle : '',
      thankYouText: data.thanksText ? data.thanksText : '',
      thankYouRedirect: data.thanksRedirect ? data.thanksRedirect : '',
    },
  },
  url: {
    name: t('createCallout.steps.url.title'),
    description: t('createCallout.steps.url.description'),
    validated: data.intro ? true : false,
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
    validated: data.intro ? true : false,
    component: markRaw(StepDatesAndDuration),
    data: {
      startNow: true,
      hasEndDate: false,
      startDate: '',
      endDate: '',
    },
  },
});
async function submitForm() {
  // @ts-expect-error
  const callout: CreateCalloutData = makeCalloutData(steps);

  if (mode === 'edit') {
    const newCallout = await editCallout(callout);
  } else if (mode === 'new') {
    const newCallout = await createCallout(callout);
  }
  router.push({
    path: '/admin/callouts/edit/' + callout.slug,
    query: { created: null },
  });
}
onBeforeMount(async () => {
  const calloutId = route.params.id as string;
  await fetchCallout(calloutId)
    .then((c) => (steps.value = makeStepsData(c)))
    //@ts-expect-error
    .catch((err) => (steps.value = makeStepsData({})));
});
</script>
