<template>
  <AppHeading class="mb-3">Dates and duration</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        inputType="date"
        v-model="dataProxy.callout_start_date"
        :label="'Schedule a start date'"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      You can set a publish date for this callout or keep it as a draft to
      publish or schedule it later.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <AppHeading>When should this callout end?</AppHeading>
      <AppRadioGroup
        name="calloutHasEndDate"
        :options="['Never, unless manually closed', 'Schedule an end date']"
        v-model="dataProxy.calloutHasEndDate"
      />
      <div v-show="showEndDateScheduler === true">
        <AppInput
          inputType="date"
          v-model="dataProxy.callout_end_date"
          :label="''"
        ></AppInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: {
    calloutHasEndDate: string;
    callout_start_date: string;
    callout_end_date: string;
  };
}>();

const isEndDateAfterStartDate = (start: string, end: string): boolean => {
  const start_date = Date.parse(start);
  const end_date = Date.parse(end);
  return start_date < end_date ? true : false;
};
const dataProxy = ref(props.data);

const showEndDateScheduler = computed(
  () => dataProxy.value.calloutHasEndDate === 'Schedule an end date'
);

watch(
  () =>
    isEndDateAfterStartDate(
      dataProxy.value.callout_start_date,
      dataProxy.value.callout_end_date
    ),
  (valid) => emit('update:validated', valid)
);
</script>
