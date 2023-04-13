<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <AppAlert v-if="wasJustReplicated" variant="success" class="mb-4">
      {{ t('editCallout.replicated') }}
    </AppAlert>

    <AppAlert v-else-if="warnAboutEditing" variant="warning" class="mb-4">
      <template #icon>
        <font-awesome-icon :icon="faExclamation" />
      </template>
      {{ t('editCallout.warning') }}
    </AppAlert>

    <AppFormSection :help="inputT('intro.help')">
      <RichTextEditor
        v-model="data.introText"
        :label="inputT('intro.label')"
        required
      />
    </AppFormSection>
    <div class="callout-form-builder mt-8">
      <FormBuilderVue
        ref="formBuilderRef"
        :form="data.formSchema"
        :options="formOpts"
        @change="handleFormChange"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { onBeforeMount, ref, watch } from 'vue';
import { FormBuilder as FormBuilderVue } from 'vue-formio';
import { FormBuilder } from 'formiojs';
import {
  faQuestionCircle,
  faTerminal,
  faFont,
  faHashtag,
  faAsterisk,
  faCheckSquare,
  faPlusSquare,
  faThList,
  faDotCircle,
  faStop,
  faCog,
  faArrowsAlt,
  faWrench,
  faCopy,
  faTimes,
  faBars,
  faTimesCircle,
  faPlus,
  IconName,
  faExclamation,
  faCode,
  faColumns,
  faThLarge,
  faListAlt,
  faTable,
  faFolder,
  faSquare,
  faParagraph,
  faAt,
  faLink,
  faPhoneSquare,
  faTags,
  faHome,
  faCalendar,
  faClock,
  faUsd,
  faList,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { dom, library } from '@fortawesome/fontawesome-svg-core';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ContentStepProps } from '../callouts.interface';
import AppAlert from '../../../AppAlert.vue';
import RichTextEditor from '../../../rte/RichTextEditor.vue';
import AppFormSection from '../../../forms/AppFormSection.vue';

import 'formiojs/dist/formio.builder.css';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: ContentStepProps;
  status: ItemStatus | undefined;
}>();

const { t } = useI18n();
const route = useRoute();
const inputT = (key: string) => t('createCallout.steps.content.inputs.' + key);

const warnAboutEditing = computed(
  () => props.status === ItemStatus.Open || props.status === ItemStatus.Ended
);

const wasJustReplicated = route.query.replicated !== undefined;

const validation = useVuelidate();

watch(
  [validation, props.data.formSchema],
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit(
      'update:validated',
      !validation.value.$invalid && props.data.formSchema.components.length > 1
    );
  },
  { immediate: true }
);

const formOpts = {
  builder: {
    data: false,
    resource: false,
    premium: false,
  },
};
const formBuilderRef = ref<FormBuilder>();

function handleFormChange() {
  // eslint-disable-next-line vue/no-mutating-props
  props.data.formSchema = formBuilderRef.value?.form;
}

onBeforeMount(() => {
  library.add(
    faQuestionCircle,
    faTerminal,
    faFont,
    faHashtag,
    faAsterisk,
    faCheckSquare,
    faPlusSquare,
    faThList,
    faStop,
    faCog,
    faWrench,
    faCopy,
    faBars,
    faPlus,
    faCode,
    faColumns,
    faThLarge,
    faListAlt,
    faTable,
    faAt,
    faLink,
    faPhoneSquare,
    faTags,
    faHome,
    faCalendar,
    faUsd,
    faList,
    faPencil,

    // Use different icon names so they match
    { ...faClock, iconName: 'clock-o' as IconName },
    { ...faParagraph, iconName: 'html5' },
    { ...faFolder, iconName: 'folder-o' as IconName },
    { ...faSquare, iconName: 'square-o' as IconName },
    { ...faTimesCircle, iconName: 'times-circle-o' as IconName },
    { ...faDotCircle, iconName: 'dot-circle-o' as IconName },
    { ...faArrowsAlt, iconName: 'arrows' },
    { ...faTimes, iconName: 'remove' as IconName }
  );
  // This will automatically replace all <i> tags with the icons above
  dom.watch();
});
</script>
<style lang="postcss">
.callout-form-builder {
  .drag-and-drop-alert {
    @apply mb-4 border border-dashed border-primary p-4;
  }

  .formbuilder {
    @apply flex flex-row-reverse justify-end gap-8;
  }

  .formarea {
    @apply max-w-2xl flex-1;
  }

  .formcomponents {
    @apply flex-initial basis-[15rem];
  }

  .formcomponent {
    @apply m-0 block w-full cursor-pointer rounded border border-primary-70 bg-white px-2 text-sm text-primary-80 hover:border-primary hover:bg-primary-10 hover:text-primary !important;
    &.gu-transit {
      @apply mb-4 text-base !important;
    }
  }

  .form-builder-panel {
    @apply mb-2;
  }

  .form-builder-group-header {
    @apply cursor-pointer rounded bg-primary-20 text-sm font-semibold hover:bg-primary-40;
  }

  .builder-group-button {
    @apply w-full p-2;
  }

  .builder-sidebar_search {
    @apply hidden;
  }

  #group-container-basic,
  #group-container-layout {
    @apply flex w-full flex-col gap-1 border border-primary-10 p-2;
  }

  .component-settings-button {
    @apply bg-white text-center;
  }
}

.formio-dialog {
  @apply font-body text-sm text-body !important;

  .formio-dialog-content {
    @apply bg-white !important;
  }

  .nav {
    @apply mb-4 flex flex-wrap border-b border-primary-40;
  }
  .nav-item {
    @apply p-3 text-sm leading-none;
    &.active {
      @apply border-b-2 border-link font-bold text-link;
    }

    /* Hide Logic and Layout tabs */
    &:nth-last-child(2),
    &:last-child {
      @apply hidden;
    }
  }
  .nav-link {
    @apply p-0 !important;
  }

  .row {
    @apply flex gap-8;
  }

  .col {
    @apply flex-1;
  }

  .form-group {
    @apply mb-3;
  }

  .table {
    @apply w-full border-collapse;
    thead {
      @apply border-b border-primary-20 text-sm;
    }
    th {
      @apply text-left;
    }
    th,
    td {
      @apply p-1;
    }
    .form-group {
      @apply mb-0;
    }
  }

  .card[class*='border'] {
    @apply border-grey-light;
    .card-header {
      @apply border-b border-grey-light;
    }
  }
  .card-header,
  .card-body {
    @apply p-3;
  }
  .card-title {
    @apply text-base font-semibold;
  }

  .formio-component-tabs > .card {
    & > .card-header,
    & > .card-body {
      @apply p-0;
    }
  }

  .preview-panel .card-body {
    @apply bg-white;
  }

  /* Hide first row (contains a header and link to help) */
  .component-edit-container > .row:first-child {
    @apply hidden;
  }
}
</style>
