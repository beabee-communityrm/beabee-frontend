<route lang="yaml">
name: adminCalloutNew
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <CalloutForm v-if="steps" :steps="steps" :mode="id ? 'edit' : 'new'" />
</template>

<script lang="ts" setup>
import { ref, markRaw, onBeforeMount, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchCallout } from '../../../utils/api/callout';
import type { GetMoreCalloutData } from '../../../utils/api/api.interface';

import StepVisibility from '../../../components/pages/callouts/steps/Visibility.vue';
import StepTitleAndImage from '../../../components/pages/callouts/steps/TitleAndImage.vue';
import StepEndMessage from '../../../components/pages/callouts/steps/EndMessage.vue';
import StepUrlAndSharing from '../../../components/pages/callouts/steps/UrlAndSharing.vue';
// import StepMailchimpSync from '../components/steps/MailchimpSync.vue';
import StepDatesAndDuration from '../../../components/pages/callouts/steps/DatesAndDuration.vue';
import StepContent from '../../../components/pages/callouts/steps/Content.vue';
import { CalloutSteps } from '../../../components/pages/callouts/callouts.interface';
import CalloutForm from '../../../components/pages/callouts/CalloutForm.vue';
import { format } from 'date-fns';

const props = defineProps<{ id?: string }>();

const { t } = useI18n();

const steps: Ref<null | CalloutSteps> = ref(null);

const makeStepsData = (data?: GetMoreCalloutData): CalloutSteps => ({
  content: {
    name: t('createCallout.steps.content.title'),
    description: t('createCallout.steps.content.description'),
    validated: data ? true : false,
    error: false,
    component: markRaw(StepContent),
    data: {
      introText: data?.intro || '',
      formSchema: data?.formSchema || { components: [] },
    },
  },
  titleAndImage: {
    name: t('createCallout.steps.titleAndImage.title'),
    description: t('createCallout.steps.titleAndImage.description'),
    validated: data ? true : false,
    error: false,
    component: markRaw(StepTitleAndImage),
    data: {
      title: data?.title || '',
      description: data?.excerpt || '',
      coverImageURL: data?.image || '',
    },
  },
  visibility: {
    name: t('createCallout.steps.visibility.title'),
    description: t('createCallout.steps.visibility.description'),
    validated: data ? true : false,
    error: false,
    component: markRaw(StepVisibility),
    data: {
      whoCanTakePart: data?.access
        ? data?.access === 'member'
          ? 'members'
          : 'everyone'
        : 'members',
      allowAnonymousResponses: data?.access
        ? data?.access === 'anonymous'
          ? true
          : false
        : false,
      showOnUserDashboards: data?.hidden || false,
      usersCanEditAnswers: data?.allowUpdate || false,
    },
  },
  endMessage: {
    name: t('createCallout.steps.endMessage.title'),
    description: t('createCallout.steps.endMessage.description'),
    validated: data ? true : false,
    error: false,
    component: markRaw(StepEndMessage),
    data: {
      whenFinished: 'message',
      thankYouTitle: data?.thanksTitle ? data?.thanksTitle : '',
      thankYouText: data?.thanksText ? data?.thanksText : '',
      thankYouRedirect: data?.thanksRedirect ? data?.thanksRedirect : '',
    },
  },
  url: {
    name: t('createCallout.steps.url.title'),
    description: t('createCallout.steps.url.description'),
    validated: data ? true : false,
    error: false,
    component: markRaw(StepUrlAndSharing),
    data: {
      useCustomSlug: data ? true : false,
      autoSlug: '',
      slug: data?.slug || '',
      overrideShare: data?.shareTitle ? true : false,
      shareTitle: data?.shareTitle ? data?.shareTitle : '',
      shareDescription: data?.shareDescription ? data?.shareDescription : '',
    },
  },
  /*mailchimp: {
    name: t('createCallout.steps.mailchimp.title'),
    description: t('createCallout.steps.mailchimp.description'),
    validated: false,
    error: false,
    component: markRaw(StepMailchimpSync),
    data: {
      useMailchimpSync: false,
    },
  },*/
  dates: {
    name: t('createCallout.steps.dates.title'),
    description: t('createCallout.steps.dates.description'),
    validated: data ? true : false,
    error: false,
    component: markRaw(StepDatesAndDuration),
    data: {
      startNow: data ? true : false,
      hasEndDate: !!data?.expires,
      startDate: data?.starts ? format(data.starts, 'yyyy-MM-dd') : '',
      endDate: data?.expires ? format(data.expires, 'yyyy-MM-dd') : '',
    },
  },
});

onBeforeMount(async () => {
  steps.value = props.id
    ? makeStepsData(await fetchCallout(props.id))
    : makeStepsData();
});
</script>
