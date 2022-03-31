<template>
  <AppHeading class="mb-3">{{ t('createCallout.steps.url.title') }}</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.slug"
        :label="inputT('slug.label')"
        :placeholder="inputT('slug.placeholder')"
      ></AppInput>
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
      ></AppInput>
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
      ></AppTextArea>
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('description.help')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
import { UrlAndSharingStepProps } from '../create-callout.interface';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: UrlAndSharingStepProps }>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.url.inputs.' + key);

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);

watch(
  () =>
    isNotEmptyString(props.data.slug) &&
    isNotEmptyString(props.data.meta_title) &&
    isNotEmptyString(props.data.meta_description),
  (valid) => emit('update:validated', valid)
);
</script>
