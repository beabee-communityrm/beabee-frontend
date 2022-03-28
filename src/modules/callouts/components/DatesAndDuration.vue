<template>
  <AppHeading class="mb-3">{{
    t('createCallout.steps.dates.title')
  }}</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        inputType="date"
        v-model="dataProxy.callout_start_date"
        :label="inputT('starts.label')"
      ></AppInput>
    </div>
    <div class="col-span-1 text-sm text-grey mt-6" />
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('expires.label') }}</p>
      <AppRadioGroup
        name="calloutHasEndDate"
        :options="[
          inputT('expires.opts.never'),
          inputT('expires.opts.schedule'),
        ]"
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
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.dates.inputs.' + key);

const isEndDateAfterStartDate = (start: string, end: string): boolean => {
  const start_date = Date.parse(start);
  const end_date = Date.parse(end);
  return start_date < end_date ? true : false;
};
const dataProxy = ref(props.data);

const showEndDateScheduler = computed(
  () => dataProxy.value.calloutHasEndDate === inputT('expires.opts.schedule')
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
