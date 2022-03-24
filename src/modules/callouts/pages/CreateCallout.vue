<template>
  <h4>Create a new callout</h4>
  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-1">
      <Stepper :steps="steps" v-model:selectedStepIndex="selectedStepIndex" />
    </div>
    <div class="col-span-2">
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
import { reactive, ref, computed } from 'vue';
import Stepper from '../components/Stepper.vue';
import Visibility from '../components/Visibility.vue';
import TitleAndImage from '../components/TitleAndImage.vue';
import EndMessage from '../components/EndMessage.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import UrlAndSharing from '../components/UrlAndSharing.vue';
import MailchimpSync from '../components/MailchimpSync.vue';

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
    id: 'first',
    name: 'Title and image',
    description: 'Set a title, description and image for the callout',
    validated: false,
    component: TitleAndImage,
    data: { title: '', description: '' },
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
]);

const submitForm = () => true;

const selectedStepIndex = ref(0);
const selectedStep = computed(() => steps[selectedStepIndex.value]);
</script>
