<template>
  <Form
    class="callout-form-renderer"
    :class="{ 'has-no-bg': noBg }"
    :form="form"
    :submission="answers && { data: answers }"
    :options="formOpts"
    @submit="$emit('submit', $event)"
  />
</template>
<script lang="ts" setup>
import {
  CalloutFormSchema,
  CalloutResponseAnswers,
} from '@beabee/beabee-common';
import { computed, onBeforeMount } from 'vue';
import { Form } from '../../lib/formio';
import { FormSubmission } from './form-renderer.interface';
import { config, dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendar,
  faCloudUpload,
  faCross,
  faRefresh,
  faRemove,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';

defineEmits<{
  (e: 'submit', submission: FormSubmission): void;
}>();
const props = defineProps<{
  form: CalloutFormSchema;
  answers?: CalloutResponseAnswers;
  readonly?: boolean;
  noBg?: boolean;
  beforeSubmit?: (submission: FormSubmission) => boolean;
}>();

const formOpts = computed(() => ({
  readOnly: props.readonly,
  noAlerts: true,
  renderMode: props.readonly ? 'html' : 'form',
  hooks: {
    beforeSubmit: (
      submission: FormSubmission,
      next: (err?: unknown) => void
    ) => {
      const canSubmit = !props.beforeSubmit || props.beforeSubmit(submission);
      next(canSubmit ? undefined : true);
    },
  },
}));

onBeforeMount(() => {
  library.add(
    faCalendar,
    faCamera,
    faCross,
    faCloudUpload,
    faRemove,
    faRefresh
  );
  config.autoReplaceSvg = 'nest';
  dom.watch();
});
</script>

<style>
@import '../../lib/formio/formio.form.css';
@import './form-renderer.css';
</style>
