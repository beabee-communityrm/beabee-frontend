<template>
  <AppHeading class="mb-3">Title and image</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput v-model="calloutTitle" :label="'Title'"></AppInput>
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
        v-model="calloutDescription"
        :label="'Short description'"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Short description</b> expands on the title to explain what the
      callout is about. It is meant to quickly inform people of what is inside
      in a few words.
    </p>
  </div>

  <AppButton :disabled="!valid" @click="handleClick" class=""
    >Continue</AppButton
  >
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import AppButton from '../../../components/forms/AppButton.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppHeading from '../../../components/AppHeading.vue';

const props = defineProps<{ data: { title: string; description: string } }>();
const calloutTitle = ref(props.data.title);
const calloutDescription = ref(props.data.description);

const keyNotEmpty = (obj: { value: string }) => obj.value.length > 0;
const valid = computed(
  (): boolean => keyNotEmpty(calloutTitle) && keyNotEmpty(calloutDescription)
);

const emit = defineEmits(['update:data', 'update:validated']);
const handleClick = () => {
  emit('update:data', { title: calloutTitle, description: calloutDescription });
  emit('update:validated', true);
};
</script>
