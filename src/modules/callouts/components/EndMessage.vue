<template>
  <AppHeading class="mb-3">{{
    t('createCallout.steps.endMessage.title')
  }}</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('action.label') }}</p>
      <AppRadioGroup
        name="whenFinished"
        :options="[
          inputT('action.opts.showMessage'),
          inputT('action.opts.redirect'),
        ]"
        v-model="dataProxy.whenFinished"
      />
    </div>
  </div>
  <div
    class="grid grid-cols-2 gap-6 mt-5"
    v-show="showThankYouSection === true"
  >
    <div class="col-span-1 mb-5">
      <AppInput
        v-model="dataProxy.thankYouTitle"
        :label="inputT('title.label')"
        :placeholder="inputT('title.placeholder')"
      ></AppInput>
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('title.help')"
    />
  </div>
  <div class="grid grid-cols-2 gap-6" v-show="showThankYouSection === true">
    <div class="col-span-1">
      <AppTextArea
        v-model="dataProxy.thankYouText"
        :label="inputT('text.label')"
        :placeholder="inputT('text.placeholder')"
      ></AppTextArea>
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('text.help')"
    />
  </div>
  <div
    class="grid grid-cols-2 gap-6 mt-5"
    v-show="showRedirectSection === true"
  >
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.URLRedirect"
        :label="inputT('url.label')"
        :placeholder="inputT('url.placeholder')"
      ></AppInput>
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('url.help')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: {
    whenFinished: string;
    thankYouTitle: string;
    thankYouText: string;
    URLRedirect: string;
  };
}>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.endMessage.inputs.' + key);

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);
const showThankYouSection = computed(
  () => dataProxy.value.whenFinished === 'Show a thank you message'
);
const showRedirectSection = computed(
  () => dataProxy.value.whenFinished === 'Redirect them to another page'
);

watch(
  () =>
    (isNotEmptyString(props.data.whenFinished) &&
      isNotEmptyString(props.data.thankYouTitle) &&
      isNotEmptyString(props.data.thankYouText)) ||
    (isNotEmptyString(props.data.whenFinished) &&
      isNotEmptyString(props.data.URLRedirect)),
  (valid) => emit('update:validated', valid)
);
</script>
