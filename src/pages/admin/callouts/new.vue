<route lang="yaml">
name: adminCalloutNew
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <CalloutForm
    v-if="steps"
    :steps-props="steps"
    :status="status"
    @update="handleUpdate"
    @save-draft="handleSaveDraft"
  />
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
  createCallout,
  fetchCallout,
  updateCallout,
} from '../../../utils/api/callout';
import type { CreateCalloutData } from '../../../utils/api/api.interface';

import { CalloutStepsProps } from '../../../components/pages/callouts/callouts.interface';
import CalloutForm from '../../../components/pages/callouts/CalloutForm.vue';
import { ItemStatus } from '@beabee/beabee-common';
import {
  convertCalloutToSteps,
  convertStepsToCallout,
} from '../../../utils/callouts';

const props = defineProps<{ id?: string }>();

const { t } = useI18n();
const router = useRouter();

const steps = ref<CalloutStepsProps>();
const status = ref<ItemStatus>();

async function updateOrCreateCallout(data: CreateCalloutData) {
  return props.id
    ? await updateCallout(props.id, data)
    : await createCallout(data);
}

async function handleUpdate() {
  if (!steps.value) return; // Can't save without steps

  const data = convertStepsToCallout(steps.value);
  const newCallout = await updateOrCreateCallout(data);

  router.push({
    path: '/admin/callouts/view/' + newCallout.slug,
    query: {
      [props.id ? 'updated' : 'created']: null,
    },
  });
}

async function handleSaveDraft() {
  if (!steps.value) return; // Can't save without steps

  const data = convertStepsToCallout(steps.value);

  const newCallout = await updateOrCreateCallout({
    ...data,
    title: data.title || t('createCallout.untitledCallout'),
    slug: data.slug || 'something-unique',
    starts: null,
    expires: null,
  });

  if (!props.id) {
    router.push({
      path: '/admin/callouts/edit/' + newCallout.slug,
    });
  }
}

onBeforeMount(async () => {
  const callout = props.id ? await fetchCallout(props.id, ['form']) : undefined;
  steps.value = convertCalloutToSteps(callout);
  status.value = callout?.status;

  if (!steps.value.content.formSchema.components.length) {
    steps.value.content.formSchema.components.push({
      type: 'button',
      label: t('actions.submit'),
      key: 'submit',
      size: 'md',
      block: false,
      action: 'submit',
      disableOnInvalid: true,
      theme: 'primary',
    });
  }
});
</script>
