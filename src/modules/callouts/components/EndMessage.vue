<template>
  <AppHeading class="mb-3"> End message </AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <p class="font-semibold">When the user finishes answering the callout:</p>
      <AppRadioGroup
        name="whenFinished"
        :options="['Show a thank you message', 'Redirect them to another page']"
        v-model="dataProxy.whenFinished"
      />
    </div>
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.thankYouTitle"
        :label="'Thank you title'"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      Your readers will see the <b>Thank you title</b> when they finish
      answering the callout.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.thankYouText"
        :label="'Thank you text'"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      Here you can thank them in more detail, ask them to share the callout. Let
      them know if and when they can expect updates or follow-ups.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: {
    whenFinished: string;
    thankYouTitle: string;
    thankYouText: string;
  };
}>();

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);

watch(
  () =>
    isNotEmptyString(props.data.whenFinished) &&
    isNotEmptyString(props.data.thankYouTitle) &&
    isNotEmptyString(props.data.thankYouText),
  (valid) => emit('update:validated', valid)
);
</script>
