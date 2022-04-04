<template>
  <div>
    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.slug"
          :label="inputT('slug.label')"
          :placeholder="inputT('slug.placeholder')"
          required
          :error-message="validation.slug.$errors[0]?.$message"
          @blur="validation.slug.$touch"
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('slug.help')"
      />
    </div>
    <div class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.meta_title"
          :label="inputT('title.label')"
          :placeholder="inputT('title.placeholder')"
          required
          :error-message="validation.meta_title.$errors[0]?.$message"
          @blur="validation.meta_title.$touch"
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('title.help')"
      />
    </div>
    <div class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppTextArea
          v-model="dataProxy.meta_description"
          :label="inputT('description.label')"
          :placeholder="inputT('description.placeholder')"
          required
          :error-message="validation.meta_description.$errors[0]?.$message"
          @blur="validation.meta_description.$touch"
        ></AppTextArea>
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('description.help')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../components/forms/AppInput.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
import { UrlAndSharingStepProps } from '../create-callout.interface';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: UrlAndSharingStepProps }>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.url.inputs.' + key);

const dataProxy = ref(props.data);

const validation = useVuelidate(
  {
    slug: { required },
    meta_title: { required },
    meta_description: { required },
  },
  dataProxy
);

watch(validation, () => emit('update:validated', !validation.value.$invalid));
</script>
