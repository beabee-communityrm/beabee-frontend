<template>
  <h4>Create a new callout</h4>
  <div class="grid grid-cols-4 gap-8">
    <div class="col-span-1">
      <Stepper :steps="steps" v-model:selectedStepIndex="selectedStepIndex" />
    </div>
    <div class="col-span-3">
      <component
        :is="selectedStep.component"
        v-model:data="selectedStep.data"
        v-model:validated="selectedStep.validated"
      ></component>

      <div class="flex mt-5">
        <AppButton
          variant="linkOutlined"
          :disabled="selectedStep === steps[0]"
          @click="selectedStepIndex--"
          >Back</AppButton
        >
        <AppButton
          class="ml-2"
          v-show="selectedStepIndex != steps.length - 1"
          :disabled="!selectedStep.validated"
          @click="selectedStepIndex++"
          >Continue</AppButton
        >
        <AppButton
          class="ml-2"
          v-show="selectedStepIndex === steps.length - 1"
          :disabled="!selectedStep.validated"
          @click="submitForm"
          >Submit</AppButton
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

export type Step = {
  id: string;
  name: string;
  description: string;
  validated: boolean;
  component: any;
  data: {};
};
export type Steps = Array<Step>;

const steps: Steps = reactive([
  {
    id: 'content',
    name: 'Callout content',
    description: 'Build your callout with questions and prompts',
    validated: false,
    component: markRaw(ContentStep),
    data: { introText: '', formSchema: { components: [] } },
  },
  {
    id: 'first',
    name: 'Title and image',
    description: 'Set a title, description and image for the callout',
    validated: false,
    component: TitleAndImage,
    data: { title: '', description: '', coverImageURL: '' },
  },
  {
    id: 'second',
    name: 'Visibility settings',
    description: 'Specify callout visibility and other details',
    validated: false,
    component: Visibility,
    data: {
      whoCanTakePart: '',
      allowAnonymousResponses: '',
      showOnUserDashboards: '',
      usersCanEditAnswers: '',
    },
  },
  {
    id: 'third',
    name: 'End message',
    description: 'Set a final thank you message or page to redirect',
    validated: false,
    component: EndMessage,
    data: {
      whenFinished: '',
      thankYouTitle: '',
      thankYouText: '',
      URLRedirect: '',
    },
  },
  {
    id: 'Fourth',
    name: 'URL and sharing',
    description: 'Adjust how the callout will appear and how to access it',
    validated: false,
    component: UrlAndSharing,
    data: {
      slug: '',
      meta_title: '',
      meta_description: '',
    },
  },
  {
    id: 'Fifth',
    name: 'Mailchimp sync',
    description: 'Set up Mailchimp integrations',
    validated: false,
    component: MailchimpSync,
    data: {
      useMailchimpSync: '',
    },
  },
  {
    id: 'Sixth',
    name: 'Dates and duration',
    description: 'Schedule your callout and for how long it will be live',
    validated: false,
    component: DatesAndDurationVue,
    data: {
      calloutHasEndDate: '',
      callout_start_date: '',
      callout_end_date: '',
    },
  },
]);

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

const submitForm = () => createCallout(makeCalloutData(steps));

const selectedStepIndex = ref(0);
const selectedStep = computed(() => steps[selectedStepIndex.value]);
</script>
