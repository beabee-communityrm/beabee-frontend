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
  faRefresh,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';
import {
  config,
  dom,
  library,
  noAuto,
} from '@fortawesome/fontawesome-svg-core';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { FormBuilder } from 'vue-formio';
import { CalloutPageSchema, CalloutFormSchema } from '@beabee/beabee-common';
import { getPageSchema } from '../../utils/callouts';

import './components/Decision';

import 'formiojs/dist/formio.builder.css';

interface FormBuilderRef {
  form: CalloutFormSchema;
  builder: {
    instance: {
      addPage(page: { schema: CalloutPageSchema }): void;
      removePage(page: number): void;
      setPage(page: number): void;
    };
  };
}

const formOpts = {
  builder: {
    basic: false,
    advanced: false,
    data: false,
    resource: false,
    premium: false,
    layout: false,
    custom: {
      title: 'Basic',
      default: true,
      components: {
        textfield: {
          title: 'Text Field',
          icon: 'terminal',
          schema: {
            type: 'textfield',
          },
        },
        textarea: {
          title: 'Text Area',
          icon: 'font',
          schema: {
            type: 'textarea',
          },
        },
        number: {
          title: 'Number',
          icon: 'hashtag',
          schema: {
            type: 'number',
          },
        },
        email: {
          title: 'Email',
          icon: 'at',
          schema: {
            type: 'email',
          },
        },
        url: {
          title: 'Url',
          icon: 'link',
          schema: {
            type: 'url',
          },
        },
        checkbox: {
          title: 'Checkbox',
          icon: 'check-square',
          schema: {
            type: 'checkbox',
          },
        },
        select: {
          title: 'Dropdown',
          icon: 'th-list',
          schema: {
            type: 'select',
          },
        },
        selectboxes: {
          title: 'Select Boxes',
          group: 'basic',
          icon: 'plus-square',
          schema: {
            type: 'selectboxes',
          },
        },
        radio: {
          title: 'Radio',
          icon: 'dot-circle-o',
          schema: {
            type: 'radio',
          },
        },
      },
    },
    custom2: {
      title: 'Advanced',
      components: {
        decision: {
          title: 'Decision',
          icon: 'code-branch',
          schema: {
            type: 'decision',
          },
        },
        address: {
          title: 'Address',
          icon: 'home',
          schema: {
            type: 'address',
          },
        },
        phoneNumber: {
          title: 'Phone Number',
          icon: 'phone-square',
          schema: {
            type: 'phoneNumber',
          },
        },
        currency: {
          title: 'Currency',
          icon: 'usd',
          schema: {
            type: 'currency',
          },
        },
        datetime: {
          title: 'Date / Time',
          icon: 'calendar',
          schema: {
            type: 'datetime',
          },
        },
        time: {
          title: 'Time',
          icon: 'clock-o',
          schema: {
            type: 'time',
          },
        },
        signature: {
          title: 'Signature',
          icon: 'pencil',
          schema: {
            type: 'signature',
          },
        },
        content: {
          title: 'Content',
          icon: 'html5',
          schema: {
            type: 'content',
          },
        },
      },
    },
  },
};

const emit = defineEmits<{
  (e: 'change', components: CalloutPageSchema[]): void;
}>();
const props = defineProps<{
  form: CalloutFormSchema;
}>();

const formBuilderRef = ref<FormBuilderRef | null>(null);

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
    faRefresh,
    faCodeBranch,

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
  config.autoReplaceSvg = 'nest';
  dom.watch();
});

onBeforeUnmount(() => {
  noAuto();
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

  #group-container-custom,
  #group-container-custom2,
  #group-container-layout {
    @apply flex w-full flex-col gap-1 border border-primary-10 p-2;
  }

  .component-settings-button {
    @apply h-auto w-8 bg-white text-center text-base;
  }
}

.is-wizard .callout-form-builder {
  /* Hide panel component settings */
  .formio-form
    > .builder-components
    > .builder-component
    > .component-btn-group {
    @apply hidden;
  }
}

.formio-dialog {
  @apply flex items-center justify-center font-body text-base text-body !important;

  .formio-dialog-content {
    @apply max-w-[70rem] bg-white !important;
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
    @apply grid auto-cols-fr  grid-flow-col;
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

  .component-edit-container {
    @apply overflow-auto;
  }

  /* Hide first row (contains a header and link to help) */
  .component-edit-container > .row:first-child {
    @apply hidden;
  }

  /* Hide empty shortcut column */
  .formio-component-values .table tr :nth-child(4) {
    @apply hidden;
  }
}

body:not(.show-advanced-options) {
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
  .formio-component-dataType,
  .formio-component-validateOn,
  .formio-component-custom-validation-js,
  .formio-component-json-validation-json,
  .formio-component-errors,
  .formio-component-customConditionalPanel,
  .formio-component-properties,
  .formio-component-tags {
    @apply hidden;
  }

  .callout-form-builder {
    .component-settings-button-edit-json {
      @apply hidden;
    }
  }
}
</style>
