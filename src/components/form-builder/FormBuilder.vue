<template>
  <FormBuilder
    ref="formBuilderRef"
    :form="form"
    :options="formOpts"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
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
  faRefresh,
  faCloudUpload,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { dom, library } from '../../lib/fontawesome';
import { onBeforeMount, ref } from 'vue';

import { FormBuilder } from '../../lib/formio';
import {
  CalloutComponentSchema,
  CalloutFormSchema,
} from '@beabee/beabee-common';
import { formOpts, FormBuilderRef } from './form-builder.interface';

const emit = defineEmits<{
  (e: 'change', components: CalloutComponentSchema[]): void;
}>();

defineProps<{
  form: CalloutFormSchema;
}>();

const formBuilderRef = ref<FormBuilderRef>();

function handleChange() {
  if (!formBuilderRef.value) return;
  emit('change', formBuilderRef.value.form.components);
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
    faRefresh,
    faCloudUpload,
    faCamera,

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
@import '../../lib/formio/formio.builder.css';
@import '../form-renderer/form-renderer.css';

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

  #group-container-custom,
  #group-container-custom2,
  #group-container-layout {
    @apply flex w-full flex-col gap-1 border border-primary-10 p-2;
  }

  .component-settings-button {
    @apply h-auto w-8 bg-white text-center text-base;
  }
}

.formio-dialog {
  @apply font-body text-base text-body !important;

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

  /* Hide lots of options */
  .formio-component-labelPosition,
  .formio-component-tooltip,
  .formio-component-prefix,
  .formio-component-suffix,
  .formio-component-widget\.type,
  .formio-component-inputMask,
  .formio-component-displayMask,
  .formio-component-customClass,
  .formio-component-autocomplete,
  .formio-component-tabindex,
  .formio-component-allowMultipleMasks,
  .formio-component-hideLabel,
  .formio-component-showWordCount,
  .formio-component-showCharCount,
  .formio-component-mask,
  .formio-component-autofocus,
  .formio-component-spellcheck,
  .formio-component-disabled,
  .formio-component-tableView,
  .formio-component-modalEdit,
  .formio-component-theme,
  .formio-component-size,
  .formio-component-leftIcon,
  .formio-component-rightIcon,
  .formio-component-shortcut,
  .formio-component-action,
  .formio-component-saveOnEnter,
  .formio-component-editor,
  .formio-component-inputType,
  .formio-component-labelMargin,
  .formio-component-labelWidth,
  .formio-component-optionsLabelPosition,
  .formio-component-persistent,
  .formio-component-inputFormat,
  .formio-component-dbIndex,
  .formio-component-redrawOn,
  .formio-component-calculateServer,
  .formio-component-allowCalculateOverride,
  .formio-component-customDefaultValuePanel,
  .formio-component-calculateValuePanel,
  .formio-component-protected,
  .formio-component-encrypted,
  .formio-component-clearOnHide,
  .formio-component-shortcutButtons,
  .formio-component-validateOn,
  .formio-component-custom-validation-js,
  .formio-component-json-validation-json,
  .formio-component-errors,
  .formio-component-customConditionalPanel,
  .formio-component-properties,
  .formio-component-tags,
  /* Form upload component */
  .formio-component-dir,
  /* .formio-component-image, */
  .formio-component-uploadOnly,
  .formio-component-fileTypes,
  .formio-component-fileNameTemplate {
    @apply hidden;
  }
}
</style>
