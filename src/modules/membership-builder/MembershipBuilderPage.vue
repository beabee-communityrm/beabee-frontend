<template>
  <PageTitle :title="t('membershipBuilder.title')" border no-collapse />
  <div class="flex gap-8">
    <div class="flex-0 basis-menu">
      <AppStepper v-model="selectedStepIndex" :steps="steps" />
    </div>
    <div class="flex-1">
      <component :is="selectedStep.component" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import AppStepper from '../../components/stepper/AppStepper.vue';
import { Step } from '../../components/stepper/stepper.interface';
import EditJoinForm from './components/steps/EditJoinForm.vue';
import IntroMessage from './components/steps/IntroMessage.vue';
import Emails from './components/steps/Emails.vue';

const { t } = useI18n();

const selectedStepIndex = ref(0);

interface BuilderStep extends Step {
  component: any;
}

const steps: BuilderStep[] = [
  {
    name: 'Join form',
    description: 'Edit and fine tune your member signup form',
    validated: true,
    component: EditJoinForm,
  },
  {
    name: 'Intro message',
    description: 'Greet your new members',
    validated: true,
    component: IntroMessage,
  },
  {
    name: 'Welcome emails',
    description: "Write the emails they'll receive",
    validated: true,
    component: Emails,
  },
];

const selectedStep = computed(() => steps[selectedStepIndex.value]);
</script>
