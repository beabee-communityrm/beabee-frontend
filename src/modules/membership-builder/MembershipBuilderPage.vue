<template>
  <PageTitle :title="t('membershipBuilder.title')" border>
    <div class="flex-0 ml-3">
      <span v-if="dirty" class="mr-4">Unsaved changes</span>
      <AppButton :loading="updating" :disabled="!dirty" @click="handleUpdate">{{
        t('actions.update')
      }}</AppButton>
    </div>
  </PageTitle>
  <div class="flex gap-8">
    <div class="flex-0 basis-menu">
      <AppStepper v-model="selectedStepIndex" :steps="steps" />
    </div>
    <div class="flex-1">
      <div
        v-for="(step, i) in steps"
        :key="i"
        :class="{ hidden: selectedStepIndex !== i }"
      >
        <component :is="step.component" :emitter="emitter" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import mitt from 'mitt';
import { ref } from 'vue';
import type { Component } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import AppStepper from '../../components/stepper/AppStepper.vue';
import { Step } from '../../components/stepper/stepper.interface';
import EditJoinForm from './components/steps/EditJoinForm.vue';
import IntroMessage from './components/steps/IntroMessage.vue';
import Emails from './components/steps/Emails.vue';
import AppButton from '../../components/forms/AppButton.vue';
import { MembershipBuilderEmitter } from './membership-builder.interface';

const { t } = useI18n();

const selectedStepIndex = ref(0);
const updating = ref(false);
const dirty = ref(false);

interface BuilderStep extends Step {
  component: Component;
}

const steps: BuilderStep[] = [
  {
    name: t('membershipBuilder.steps.joinForm.title'),
    description: t('membershipBuilder.steps.joinForm.description'),
    validated: true,
    component: EditJoinForm,
  },
  {
    name: t('membershipBuilder.steps.intro.title'),
    description: t('membershipBuilder.steps.intro.description'),
    validated: true,
    component: IntroMessage,
  },
  {
    name: t('membershipBuilder.steps.emails.title'),
    description: t('membershipBuilder.steps.emails.description'),
    validated: true,
    component: Emails,
  },
];

const emitter: MembershipBuilderEmitter = mitt();

emitter.on('dirty', () => {
  dirty.value = true;
});

async function handleUpdate() {
  let updated = 0;

  function handleUpdated() {
    updated++;
    if (updated === steps.length) {
      updating.value = false;
      dirty.value = false;
      emitter.off('updated', handleUpdated);
    }
  }
  updating.value = true;

  emitter.emit('update');
  emitter.on('updated', handleUpdated);
}
</script>
