<template>
  <PageTitle :title="t('membershipBuilder.title')" border no-collapse />
  <div class="flex gap-8">
    <div class="flex-0 basis-menu">
      <AppStepper v-model="selectedStepIndex" :steps="steps" />
    </div>
    <div class="flex-1">
      <AppHeading class="mb-5">{{ selectedStep.name }}</AppHeading>
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
import AppHeading from '../../components/AppHeading.vue';
import JoinForm from './components/steps/JoinForm.vue';

const { t } = useI18n();

const selectedStepIndex = ref(0);

interface BuilderStep extends Step {
  component: any;
}

const steps: BuilderStep[] = [
  {
    name: 'Overview',
    description: '',
    validated: true,
    component: JoinForm,
  },
  {
    name: 'Join form',
    description: 'Edit and fine tune your member signup form',
    validated: true,
    component: JoinForm,
  },
  {
    name: 'Intro message',
    description: 'Greet your new members',
    validated: true,
    component: JoinForm,
  },
  {
    name: 'Welcome emails',
    description: "Write the emails they'll receive",
    validated: true,
    component: JoinForm,
  },
];

const selectedStep = computed(() => steps[selectedStepIndex.value]);
</script>
