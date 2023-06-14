<template>
  <FormBuilder
    ref="formBuilderRef"
    class="callout-form-builder"
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
  faSquarePlus,
  faSquareMinus,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { onBeforeMount, ref } from 'vue';
import {
  CalloutComponentSchema,
  CalloutFormSchema,
} from '@beabee/beabee-common';
import { getPageSchema } from '../../../../utils/callouts';

import 'formiojs/dist/formio.builder.css';
import { FormBuilder } from 'vue-formio';

interface FormBuilderRef {
  form: CalloutFormSchema;
  builder: {
    instance: {
      addPage(page: { schema: CalloutComponentSchema }): void;
      removePage(page: number): void;
      setPage(page: number): void;
    };
  };
}

const formOpts = { builder: { data: false, resource: false, premium: false } };

const emit = defineEmits<{
  (e: 'change', components: CalloutComponentSchema[]): void;
}>();
const props = defineProps<{
  form: CalloutFormSchema;
}>();

const formBuilderRef = ref<FormBuilderRef>();

function handleChange() {
  if (!formBuilderRef.value) return; // Can't change without being loaded
  emit('change', formBuilderRef.value.form.components);
}

function addPage() {
  if (!formBuilderRef.value) return; // Can't change without being loaded
  const newPageNo = props.form.components.length + 1;

  formBuilderRef.value.builder.instance.addPage({
    schema: getPageSchema(newPageNo),
  });
}

function setPage(pageNo: number) {
  if (!formBuilderRef.value) return; // Can't change without being loaded
  formBuilderRef.value.builder.instance.setPage(pageNo);
}

defineExpose({ addPage, setPage });

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
    faDownload,

    // Use different icon names so they match
    { ...faClock, iconName: 'clock-o' as IconName },
    { ...faParagraph, iconName: 'html5' },
    { ...faFolder, iconName: 'folder-o' as IconName },
    { ...faSquare, iconName: 'square-o' as IconName },
    { ...faTimesCircle, iconName: 'times-circle-o' as IconName },
    { ...faDotCircle, iconName: 'dot-circle-o' as IconName },
    { ...faArrowsAlt, iconName: 'arrows' },
    { ...faTimes, iconName: 'remove' as IconName },
    { ...faSquarePlus, iconName: 'plus-square-o' as IconName },
    { ...faSquareMinus, iconName: 'minus-square-o' as IconName }
  );
  // This will automatically replace all <i> tags with the icons above
  dom.watch();
});
</script>

<style lang="postcss">
.callout-form-builder {
  .drag-and-drop-alert {
    @apply bg-grey-lighter p-4;
  }

  .drag-container {
    @apply -m-2 p-2 !important;
  }

  .formbuilder {
    @apply flex flex-row-reverse justify-end gap-8;
  }

  .formarea {
    @apply max-w-2xl flex-1;
  }

  .formcomponents {
    @apply h-0 flex-initial basis-48;
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

  .builder-component {
    @apply m-0;
  }

  .builder-group-button {
    @apply w-full p-2;
  }

  .breadcrumb,
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
  .formio-component-hidden,
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
  .formio-component-multiple,
  .formio-component-encrypted,
  .formio-component-clearOnHide,
  .formio-component-shortcutButtons,
  .formio-component-validateOn {
    @apply hidden;
  }
}
</style>
