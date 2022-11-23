<template>
  <div>
    <AppFormSection>
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
    </AppFormSection>
    <template v-if="dataProxy.whenFinished === 'message'">
      <AppFormSection :help="inputT('title.help')">
        <AppInput
          v-model="dataProxy.thankYouTitle"
          :label="inputT('title.label')"
          :placeholder="inputT('title.placeholder')"
          required
        />
      </AppFormSection>
      <AppFormSection :help="inputT('text.help')">
        <RichTextEditor
          v-model="dataProxy.thankYouText"
          :label="inputT('text.label')"
          :placeholder="inputT('text.placeholder')"
          required
        />
      </AppFormSection>
    </template>
    <AppFormSection v-else :help="inputT('url.help')">
      <AppInput
        v-model="dataProxy.thankYouRedirect"
        :label="inputT('url.label')"
        :placeholder="inputT('url.placeholder')"
        type="url"
        required
      />
    </AppFormSection>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { EndMessageStepProps } from '../callouts.interface';
import RichTextEditor from '../../../rte/RichTextEditor.vue';
import AppFormSection from '../../../forms/AppFormSection.vue';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{ data: EndMessageStepProps }>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.endMessage.inputs.' + key);

const dataProxy = ref(props.data);

const validation = useVuelidate();

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});
</script>
