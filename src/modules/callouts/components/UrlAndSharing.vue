<template>
  <AppHeading class="mb-3">URL and social sharing</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.slug"
        :label="'URL slug'"
        placeholder="slug-looks-like-this"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>URL slug</b> will be used to construct the web address for this
      callout.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.meta_title"
        :label="'Meta title'"
        placeholder="The name of your callout"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Meta title</b> field sets the title as it should appear on social
      media cards. This will not affect the original callout title.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <AppTextArea
        v-model="dataProxy.meta_description"
        :label="'Meta description'"
        placeholder="Quickly explain why people should enter this callout"
      ></AppTextArea>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Meta description</b> field sets the short description as it should
      appear on social media cards. This will not affect the original callout
      description.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: { slug: string; meta_title: string; meta_description: string };
}>();

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
