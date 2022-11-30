<route lang="yaml">
name: adminCalloutNew
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div v-if="steps">
    <PageTitle
      :title="
        status
          ? t('editCallout.title', { title: steps.titleAndImage.title })
          : t('createCallout.title')
      "
      border
      no-collapse
    >
      <div class="flex gap-2">
        <AppButton variant="primaryOutlined" @click="handleSaveDraft">
          {{
            isNewOrDraft ? t('actions.saveDraft') : t('actions.revertToDraft')
          }}
        </AppButton>
        <AppButton
          v-if="status && !isLive"
          variant="primaryOutlined"
          icon="eye"
          @click="handlePreview"
        >
          {{ t('actions.preview') }}
        </AppButton>
        <AppButton :disabled="validation.$invalid" @click="handleUpdate">
          {{ updateAction }}
        </AppButton>
      </div>
    </PageTitle>
    <CalloutForm :steps-props="steps" :status="status" />
  </div>
</template>

<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import { ref, onBeforeMount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
  createCallout,
  fetchCallout,
  updateCallout,
} from '../../../utils/api/callout';
import { CalloutStepsProps } from '../../../components/pages/callouts/callouts.interface';
import CalloutForm from '../../../components/pages/callouts/CalloutForm.vue';
import {
  convertCalloutToSteps,
  convertStepsToCallout,
} from '../../../utils/callouts';
import PageTitle from '../../../components/PageTitle.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import useVuelidate from '@vuelidate/core';

const props = defineProps<{ id?: string }>();

const { t } = useI18n();
const router = useRouter();
const validation = useVuelidate();

const steps = ref<CalloutStepsProps>();
const status = ref<ItemStatus>();

// Doesn't update with current time, probably not that important
const isPublish = computed(
  () =>
    steps.value &&
    (steps.value.dates.startNow ||
      new Date(
        steps.value.dates.startDate + 'T' + steps.value.dates.startTime
      ) <= new Date())
);

const isLive = computed(
  () => status.value === ItemStatus.Open || status.value === ItemStatus.Ended
);

const isNewOrDraft = computed(
  () => !status.value || status.value === ItemStatus.Draft
);

const updateAction = computed(() =>
  isLive.value || (status.value === ItemStatus.Scheduled && !isPublish.value)
    ? t('actions.update')
    : isPublish.value
    ? t('actions.publish')
    : t('actions.schedule')
);

async function saveCallout(asDraft = false) {
  // TODO: Remove non-null assertion, handlers can't get called if steps is undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const data = convertStepsToCallout(steps.value!);

  const dataWithDefaults = {
    ...data,
    // Title and slug might not be set for new callouts
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

async function handleSaveDraft() {
  const callout = await saveCallout(true);
  router.push({ path: '/admin/callouts/edit/' + callout.slug });
  // If reverting from other status then reset form
  if (!isNewOrDraft.value) {
    await reset();
  }
  return callout;
}

async function handlePreview() {
  // Browsers require window.open to be called synchronously
  // https://www.abeautifulsite.net/posts/opening-a-new-window-after-an-async-operation/
  const previewWindow = window.open('about:blank', 'preview');
  const callout = await saveCallout(status.value === ItemStatus.Draft);

  if (previewWindow) {
    previewWindow.location.href = `/callouts/${callout.slug}?preview`;
  }
}

async function reset() {
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
}

onBeforeMount(reset);
</script>
