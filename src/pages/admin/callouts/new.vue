<route lang="yaml">
name: adminCalloutNew
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <CalloutForm
    v-if="steps"
    :steps="steps"
    :status="status"
    @save="handleSave"
  />
</template>

<script lang="ts" setup>
import { ref, markRaw, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
  createCallout,
  fetchCallout,
  updateCallout,
} from '../../../utils/api/callout';
import type {
  CreateCalloutData,
  GetCalloutDataWith,
} from '../../../utils/api/api.interface';

import StepVisibility from '../../../components/pages/callouts/steps/VisibilityStep.vue';
import StepTitleAndImage from '../../../components/pages/callouts/steps/TitleAndImage.vue';
import StepEndMessage from '../../../components/pages/callouts/steps/EndMessage.vue';
// import StepMailchimpSync from '../components/steps/MailchimpSync.vue';
import StepDatesAndDuration from '../../../components/pages/callouts/steps/DatesAndDuration.vue';
import StepContent from '../../../components/pages/callouts/steps/ContentStep.vue';
import { CalloutSteps } from '../../../components/pages/callouts/callouts.interface';
import CalloutForm from '../../../components/pages/callouts/CalloutForm.vue';
import { format } from 'date-fns';
import { ItemStatus } from '@beabee/beabee-common';

const props = defineProps<{ id?: string }>();

const { t } = useI18n();
const router = useRouter();

const steps = ref<CalloutSteps>();
const status = ref<ItemStatus>();

function convertCalloutToSteps(
  callout?: GetCalloutDataWith<'form'>
): CalloutSteps {
  return {
    content: {
      name: t('createCallout.steps.content.title'),
      description: t('createCallout.steps.content.description'),
      validated: !!callout,
      error: false,
      component: markRaw(StepContent),
      data: {
        introText: callout?.intro || '',
        formSchema: callout?.formSchema || {
          components: [
            {
              type: 'button',
              label: t('actions.submit'),
              key: 'submit',
              size: 'md',
              block: false,
              action: 'submit',
              disableOnInvalid: true,
              theme: 'primary',
            },
          ],
        },
      },
    },
    titleAndImage: {
      name: t('createCallout.steps.titleAndImage.title'),
      description: t('createCallout.steps.titleAndImage.description'),
      validated: !!callout,
      error: false,
      component: markRaw(StepTitleAndImage),
      data: {
        title: callout?.title || '',
        description: callout?.excerpt || '',
        coverImageURL: callout?.image || '',
        useCustomSlug: !!callout,
        autoSlug: '',
        slug: callout?.slug || '',
        overrideShare: !!callout?.shareTitle,
        shareTitle: callout?.shareTitle || '',
        shareDescription: callout?.shareDescription || '',
      },
    },
    visibility: {
      name: t('createCallout.steps.visibility.title'),
      description: t('createCallout.steps.visibility.description'),
      validated: !!callout,
      error: false,
      component: markRaw(StepVisibility),
      data: {
        whoCanTakePart:
          !callout || callout.access === 'member' ? 'members' : 'everyone',
        allowAnonymousResponses: callout?.access === 'anonymous',
        showOnUserDashboards: !callout?.hidden,
        usersCanEditAnswers: callout?.allowUpdate || false,
      },
    },
    endMessage: {
      name: t('createCallout.steps.endMessage.title'),
      description: t('createCallout.steps.endMessage.description'),
      validated: !!callout,
      error: false,
      component: markRaw(StepEndMessage),
      data: {
        whenFinished: callout?.thanksRedirect ? 'redirect' : 'message',
        thankYouTitle: callout?.thanksTitle || '',
        thankYouText: callout?.thanksText || '',
        thankYouRedirect: callout?.thanksRedirect || '',
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
      validated: !!callout,
      error: false,
      component: markRaw(StepDatesAndDuration),
      data: {
        startNow: !callout,
        hasEndDate: !!callout?.expires,
        startDate: callout?.starts ? format(callout.starts, 'yyyy-MM-dd') : '',
        startTime: callout?.starts ? format(callout.starts, 'HH:mm') : '',
        endDate: callout?.expires ? format(callout.expires, 'yyyy-MM-dd') : '',
        endTime: callout?.expires ? format(callout.expires, 'HH:mm') : '',
      },
    },
  };
}

function convertStepsToCallout(steps: CalloutSteps): CreateCalloutData {
  return {
    slug: steps.titleAndImage.data.useCustomSlug
      ? steps.titleAndImage.data.slug
      : steps.titleAndImage.data.autoSlug,
    title: steps.titleAndImage.data.title,
    excerpt: steps.titleAndImage.data.description,
    image: steps.titleAndImage.data.coverImageURL,
    intro: steps.content.data.introText,
    formSchema: steps.content.data.formSchema,
    starts: steps.dates.data.startNow
      ? new Date()
      : new Date(steps.dates.data.startDate + 'T' + steps.dates.data.startTime),
    expires: steps.dates.data.hasEndDate
      ? new Date(steps.dates.data.endDate + 'T' + steps.dates.data.endTime)
      : null,
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
          thanksRedirect: null,
        }
      : {
          thanksText: '',
          thanksTitle: '',
          thanksRedirect: steps.endMessage.data.thankYouRedirect,
        }),
    shareTitle: steps.titleAndImage.data.overrideShare
      ? steps.titleAndImage.data.shareTitle
      : '',
    shareDescription: steps.titleAndImage.data.overrideShare
      ? steps.titleAndImage.data.shareDescription
      : '',
  };
}

async function handleSave() {
  if (!steps.value) return; // Can't save without steps

  const calloutData = convertStepsToCallout(steps.value);
  const newCallout = props.id
    ? await updateCallout(props.id, calloutData)
    : await createCallout(calloutData);

  router.push({
    path: '/admin/callouts/view/' + newCallout.slug,
    query: {
      [props.id ? 'updated' : 'created']: null,
    },
  });
}

onBeforeMount(async () => {
  const callout = props.id ? await fetchCallout(props.id, ['form']) : undefined;
  steps.value = convertCalloutToSteps(callout);
  status.value = callout?.status;
});
</script>
