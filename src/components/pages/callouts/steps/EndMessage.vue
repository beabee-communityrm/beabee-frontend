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
          required
        />
      </div>
    </div>
    <div v-if="showThankYouSection" class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1 mb-5">
        <AppInput
          v-model="dataProxy.thankYouTitle"
          :label="inputT('title.label')"
          :placeholder="inputT('title.placeholder')"
          required
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('title.help')"
      />
    </div>
    <div v-if="showThankYouSection" class="grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <RichTextEditor
          v-model="dataProxy.thankYouText"
          :label="inputT('text.label')"
          :placeholder="inputT('text.placeholder')"
          required
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('text.help')"
      />
    </div>
    <div v-if="!showThankYouSection" class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.thankYouRedirect"
          :label="inputT('url.label')"
          :placeholder="inputT('url.placeholder')"
          type="url"
          required
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
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { EndMessageStepProps } from '../callouts.interface';
import RichTextEditor from '../../../rte/RichTextEditor.vue';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{ data: EndMessageStepProps; validated: boolean }>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.endMessage.inputs.' + key);

const dataProxy = ref(props.data);

const showThankYouSection = computed(
  () => dataProxy.value.whenFinished === 'message'
);

const validation = useVuelidate();

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});
</script>
