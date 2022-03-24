<template>
  <AppHeading class="mb-5">Title and image</AppHeading>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.title"
        :label="'Title'"
        placeholder="The name of your callout"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Title</b> will appear on all the mentions of this callout. It's
      worth spending a while coming up with the right name to get people
      interested.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <AppTextArea
        v-model="dataProxy.description"
        :label="'Short description'"
        placeholder="Quickly explain why people should enter this callout"
      ></AppTextArea>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Short description</b> expands on the title to explain what the
      callout is about. It is meant to quickly inform people of what is inside
      in a few words.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.coverImageURL"
        :label="'Cover image URL'"
        placeholder="https://"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Cover image</b> will serve as an illustration for the callout on
      menus and forms.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: { title: string; description: string; coverImageURL: string };
}>();

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
