<template>
  <div>
    <div class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.title"
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
    <div class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppTextArea
          v-model="dataProxy.description"
          :label="inputT('description.label')"
          :placeholder="inputT('description.placeholder')"
          required
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('description.help')"
      />
    </div>
    <div class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.coverImageURL"
          :label="inputT('image.label')"
          :placeholder="inputT('image.placeholder')"
          type="url"
          required
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('image.help')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
import AppTextArea from '../../../forms/AppTextArea.vue';
import useVuelidate from '@vuelidate/core';
import { TitleAndImageStepProps } from '../callouts.interface';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{ data: TitleAndImageStepProps }>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.titleAndImage.inputs.' + key);

const dataProxy = ref(props.data);

const validation = useVuelidate();

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});
</script>
