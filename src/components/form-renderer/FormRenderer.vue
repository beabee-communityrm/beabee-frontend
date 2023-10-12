<template>
  <Form
    class="callout-form-renderer"
    :class="{ 'has-no-bg': noBg }"
    :form="{ components }"
    :submission="answers && { data: answers }"
    :options="formOpts"
    @submit="$emit('submit', $event)"
  />
</template>
<script lang="ts" setup>
import {
  CalloutComponentSchema,
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
import { generalContent } from '../../store';
import { useI18n } from 'vue-i18n';

defineEmits<{
  (e: 'submit', submission: FormSubmission): void;
}>();
const props = defineProps<{
  components: CalloutComponentSchema[];
  answers?: CalloutResponseAnswers[string];
  readonly?: boolean;
  noBg?: boolean;
  beforeSubmit?: (submission: FormSubmission) => boolean;
}>();

const { t } = useI18n();

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
  language: generalContent.value.locale,
  i18n: {
    [generalContent.value.locale]: {
      'Drop files to attach,': t('formRenderer.components.file.dropFiles'),
      'use camera': t('formRenderer.components.file.useCamera'),
      or: t('formRenderer.components.file.or'),
      browse: t('formRenderer.components.file.browse'),
      'Take Picture': t('formRenderer.components.file.takePicture'),
      'Switch to file upload': t(
        'formRenderer.components.file.switchToFileUpload'
      ),
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
