<template>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppTextArea
        v-model="dataProxy.introText"
        :label="inputT('intro.label')"
        required
        :error-message="validation.introText.$errors[0]?.$message"
        @blur="validation.introText.$touch"
      />
    </div>
    <div></div>
  </div>
  <div class="callout-form-builder mt-8">
    <FormBuilderVue
      ref="formBuilderRef"
      :form="data.formSchema"
      :options="formOpts"
      @change="handleFormChange"
    />
  </div>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { onBeforeMount, ref, watch } from 'vue';
import { FormBuilder as FormBuilderVue } from 'vue-formio';
import { FormBuilder } from 'formiojs';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
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
} from '@fortawesome/free-solid-svg-icons';
import { dom, library } from '@fortawesome/fontawesome-svg-core';

import 'formiojs/dist/formio.builder.css';
import { useI18n } from 'vue-i18n';
import { ContentStepProps } from '../create-callout.interface';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: ContentStepProps;
}>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.content.inputs.' + key);

const dataProxy = ref(props.data);
const validation = useVuelidate(
  {
    introText: {
      required: helpers.withMessage('Introduction text is required', required),
    },
  },
  dataProxy
);

watch([validation, props.data.formSchema], () => {
  emit(
    'update:validated',
    !validation.value.$invalid && props.data.formSchema.components.length > 1
  );
});

const formOpts = {
  builder: {
    advanced: false,
    data: false,
    layout: false,
    resource: false,
    premium: false,
  },
};
const formBuilderRef = ref<FormBuilder>();

function handleFormChange() {
  dataProxy.value.formSchema = formBuilderRef.value?.form;
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
    // Use different icon names so they match
    { ...faTimesCircle, iconName: 'times-circle-o' as any },
    { ...faDotCircle, iconName: 'dot-circle-o' as any },
    { ...faArrowsAlt, iconName: 'arrows' },
    { ...faTimes, iconName: 'remove' as any }
  );
  // This will automatically replace all <i> tags with the icons above
  dom.watch();
});
</script>
<style>
.callout-form-builder {
  .drag-and-drop-alert {
    @apply p-4 border border-dashed border-primary mb-4;
  }

  .formbuilder {
    @apply flex flex-row-reverse gap-8 justify-end;
  }

  .formarea {
    @apply flex-1 max-w-2xl;
  }

  .formcomponents {
    @apply flex-initial basis-[15rem];
  }

  .formcomponent {
    @apply block w-full p-2 bg-grey-lighter border border-grey text-sm m-0 rounded-none !important;
    &.gu-transit {
      @apply mb-4 text-base !important;
    }
  }

  .form-builder-group-header,
  .builder-sidebar_search {
    @apply hidden;
  }

  #group-container-basic {
    @apply flex flex-col gap-1 w-full p-0;
  }

  .component-settings-button {
    @apply bg-white text-center;
  }
}

.formio-dialog {
  @apply text-body font-body text-sm !important;

  .formio-dialog-content {
    @apply bg-grey-lighter !important;
  }

  .nav {
    @apply flex flex-wrap mb-4 border-primary-40 border-b;
  }
  .nav-item {
    @apply p-3 leading-none text-sm;
    &.active {
      @apply text-link font-bold border-b-2 border-link;
    }

    /* Hide API, Logic and Layout tabs */
    &:nth-child(4),
    &:nth-child(6),
    &:nth-child(7),
    &:nth-child(8) {
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
      @apply text-sm border-b border-primary-20;
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
    @apply font-semibold text-base;
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
  .formio-component-block,
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
  .formio-component-validateOn {
    @apply hidden;
  }
}
</style>
