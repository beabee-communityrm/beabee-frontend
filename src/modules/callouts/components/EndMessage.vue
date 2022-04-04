<template>
  <div>
    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="dataProxy.whenFinished"
          name="whenFinished"
          :label="inputT('action.label')"
          :options="[
            ['message', inputT('action.opts.showMessage')],
            ['redirect', inputT('action.opts.redirect')],
          ]"
        />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6 mt-5" v-show="showThankYouSection">
      <div class="col-span-1 mb-5">
        <AppInput
          v-model="dataProxy.thankYouTitle"
          :label="inputT('title.label')"
          :placeholder="inputT('title.placeholder')"
          required
          :error-message="validation.thankYouTitle.$errors[0]?.$message"
          @blur="validation.thankYouTitle.$touch"
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('title.help')"
      />
    </div>
    <div class="grid grid-cols-2 gap-6" v-show="showThankYouSection">
      <div class="col-span-1">
        <AppTextArea
          v-model="dataProxy.thankYouText"
          :label="inputT('text.label')"
          :placeholder="inputT('text.placeholder')"
          required
          :error-message="validation.thankYouText.$errors[0]?.$message"
          @blur="validation.thankYouText.$touch"
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('text.help')"
      />
    </div>
    <div class="grid grid-cols-2 gap-6 mt-5" v-show="!showThankYouSection">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.URLRedirect"
          :label="inputT('url.label')"
          :placeholder="inputT('url.placeholder')"
          required
          :error-message="validation.URLRedirect.$errors[0]?.$message"
          @blur="validation.URLRedirect.$touch"
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('url.help')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { requiredIf, url } from '@vuelidate/validators';
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../components/forms/AppInput.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
import { EndMessageStepProps } from '../create-callout.interface';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: EndMessageStepProps; validated: boolean }>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.endMessage.inputs.' + key);

const dataProxy = ref(props.data);

const showThankYouSection = computed(
  () => dataProxy.value.whenFinished === 'message'
);

const rules = computed(() => ({
  thankYouTitle: { required: requiredIf(showThankYouSection.value) },
  thankYouText: { required: requiredIf(showThankYouSection.value) },
  URLRedirect: { required: requiredIf(!showThankYouSection.value), url },
}));

const validation = useVuelidate(rules, dataProxy);

watch(validation, () => emit('update:validated', !validation.value.$invalid));
</script>
