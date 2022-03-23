<template>
  <AppHeading class="mb-3">Title and image</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput v-model="dataProxy.title" :label="'Title'"></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Title</b> will appear on all the mentions of this callout. It's
      worth spending a while coming up with the right name to get people
      interested.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.description"
        :label="'Short description'"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Short description</b> expands on the title to explain what the
      callout is about. It is meant to quickly inform people of what is inside
      in a few words.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppHeading from '../../../components/AppHeading.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: { title: string; description: string } }>();

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);

watch(
  () =>
    isNotEmptyString(props.data.title) &&
    isNotEmptyString(props.data.description),
  (valid) => emit('update:validated', valid)
);
</script>
