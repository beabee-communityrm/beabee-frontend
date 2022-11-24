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
    @save-draft="handleSave"
    @preview="handlePreview"
    @update="handleUpdate"
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

async function saveCallout(asDraft = false) {
  // TODO: Remove non-null assertion, handlers can't get called if steps is undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const data = convertStepsToCallout(steps.value!);

  const dataWithDefaults = {
    ...data,
    title: data.title || t('createCallout.untitledCallout'),
    slug: data.slug || null,
    ...(asDraft && {
      starts: null,
      expires: null,
    }),
  };

  return props.id
    ? await updateCallout(props.id, dataWithDefaults)
    : await createCallout(dataWithDefaults);
}

async function handleUpdate() {
  const callout = await saveCallout();
  router.push({
    path: '/admin/callouts/view/' + callout.slug,
    query: { [props.id ? 'updated' : 'created']: null },
  });
}

async function handleSave() {
  const callout = await saveCallout(true);
  router.push({ path: '/admin/callouts/edit/' + callout.slug });
  return callout;
}

async function handlePreview() {
  const callout = await saveCallout(status.value === ItemStatus.Draft);
  window.open('/callouts/' + callout.slug + '?preview', 'preview');
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
