<template>
  <AppHeading class="mb-3">{{
    t('createCallout.steps.dates.title')
  }}</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.callout_start_date"
        inputType="date"
        :label="inputT('starts.label')"
      ></AppInput>
    </div>
    <div class="col-span-1 text-sm text-grey mt-6" />
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('expires.label') }}</p>
      <AppRadioGroup
        v-model="dataProxy.calloutHasEndDate"
        name="calloutHasEndDate"
        :options="[
          [false, inputT('expires.opts.never')],
          [true, inputT('expires.opts.schedule')],
        ]"
      />
      <div v-show="dataProxy.calloutHasEndDate">
        <AppInput
          v-model="dataProxy.callout_end_date"
          inputType="date"
          :label="''"
        ></AppInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';
import { DateAndDurationStepProps } from '../create-callout.interface';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: DateAndDurationStepProps }>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.dates.inputs.' + key);

const isEndDateAfterStartDate = (start: string, end: string): boolean => {
  const start_date = Date.parse(start);
  const end_date = Date.parse(end);
  return start_date < end_date ? true : false;
};
const dataProxy = ref(props.data);

watch(
  () =>
    isEndDateAfterStartDate(
      dataProxy.value.callout_start_date,
      dataProxy.value.callout_end_date
    ),
  (valid) => emit('update:validated', valid)
);
</script>
