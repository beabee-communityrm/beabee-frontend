<route lang="yaml">
name: adminMembershipBuilder
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <PageTitle :title="t('membershipBuilder.title')" border>
    <div class="flex-0 ml-3">
      <span v-if="updated" class="mr-4 text-success">
        <font-awesome-icon :icon="['fa', 'check-circle']" />
        {{ t('form.updated') }}
      </span>
      <span v-else-if="validation.$invalid" class="mr-4 text-danger">
        <font-awesome-icon :icon="['fa', 'warning']" />
        {{ t('form.errors.aggregatorTop') }}
      </span>
      <span v-else-if="dirty" class="mr-4">
        <font-awesome-icon :icon="['fa', 'info-circle']" />
        {{ t('form.unsavedChanges') }}
      </span>
      <AppButton
        :loading="updating"
        :disabled="validation.$invalid"
        @click="handleUpdate"
        >{{ t('actions.update') }}</AppButton
      >
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
        <component
          :is="step.component"
          v-model:error="step.error"
          v-model:validated="step.validated"
          :emitter="emitter"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import mitt from 'mitt';
import { markRaw, Ref, ref } from 'vue';
import type { Component } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../../components/PageTitle.vue';
import AppStepper from '../../../components/stepper/AppStepper.vue';
import { Step } from '../../../components/stepper/stepper.interface';
import EditJoinForm from '../../../components/pages/admin/membership-builder/steps/EditJoinForm.vue';
import AccountConfirmation from '../../../components/pages/admin/membership-builder/steps/AccountConfirmation.vue';
import IntroMessage from '../../../components/pages/admin/membership-builder/steps/IntroMessage.vue';
import Emails from '../../../components/pages/admin/membership-builder/steps/Emails.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { MembershipBuilderEmitter } from '../../../components/pages/admin/membership-builder/membership-builder.interface';
import useVuelidate from '@vuelidate/core';

const { t } = useI18n();

const selectedStepIndex = ref(0);
const updated = ref(false);
const updating = ref(false);
const dirty = ref(false);

interface BuilderStep extends Step {
  component: Component;
}

const steps: Ref<BuilderStep[]> = ref([
  {
    name: t('membershipBuilder.steps.joinForm.title'),
    description: t('membershipBuilder.steps.joinForm.description'),
    validated: true,
    error: false,
    component: markRaw(EditJoinForm),
  },
  {
    name: t('membershipBuilder.steps.accountConfirmation.title'),
    description: t('membershipBuilder.steps.accountConfirmation.description'),
    validated: true,
    error: false,
    component: markRaw(AccountConfirmation),
  },
  {
    name: t('membershipBuilder.steps.intro.title'),
    description: t('membershipBuilder.steps.intro.description'),
    validated: true,
    error: false,
    component: markRaw(IntroMessage),
  },
  {
    name: t('membershipBuilder.steps.emails.title'),
    description: t('membershipBuilder.steps.emails.description'),
    validated: true,
    error: false,
    component: markRaw(Emails),
  },
]);

const validation = useVuelidate();

const emitter: MembershipBuilderEmitter = mitt();

emitter.on('dirty', () => {
  dirty.value = true;
  updated.value = false;
});

async function handleUpdate() {
  let updatedNo = 0;

  function handleUpdated() {
    updatedNo++;
    if (updatedNo === steps.value.length) {
      updating.value = false;
      dirty.value = false;
      emitter.off('updated', handleUpdated);
      updated.value = true;
    }
  }
  updating.value = true;

  emitter.emit('update');
  emitter.on('updated', handleUpdated);
}
</script>
