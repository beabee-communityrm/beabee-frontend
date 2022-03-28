<template>
  <AppHeading class="mb-5">{{
    t('createCallout.steps.titleAndImage.title')
  }}</AppHeading>
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
      ></AppInput>
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('image.help')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../components/forms/AppInput.vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: { title: string; description: string; coverImageURL: string };
}>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.titleAndImage.inputs.' + key);

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);

watch(
  () =>
    isNotEmptyString(props.data.title) &&
    isNotEmptyString(props.data.description) &&
    isNotEmptyString(props.data.coverImageURL),
  (valid) => emit('update:validated', valid)
);
</script>
