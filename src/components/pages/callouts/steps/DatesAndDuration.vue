<template>
  <div>
    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppLabel :label="inputT('starts.label')" required />
        <AppRadioGroup
          v-if="mode === 'new'"
          v-model="dataProxy.startNow"
          name="calloutStartDate"
          :options="[
            [true, inputT('starts.opts.now')],
            [false, inputT('starts.opts.schedule')],
          ]"
          required
        />
        <div v-if="!dataProxy.startNow || mode === 'edit'" class="flex gap-2">
          <div>
            <AppInput v-model="dataProxy.startDate" type="date" required />
          </div>
          <div>
            <AppInput v-model="dataProxy.startTime" type="time" required />
          </div>
        </div>
      </div>
      <div class="col-span-1 mt-6 text-sm text-grey" />
    </div>
    <div class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="dataProxy.hasEndDate"
          name="calloutEndDate"
          :label="inputT('expires.label')"
          :options="[
            [false, inputT('expires.opts.never')],
            [true, inputT('expires.opts.schedule')],
          ]"
          required
        />
        <div v-if="dataProxy.hasEndDate" class="flex gap-2">
          <div>
            <AppInput v-model="dataProxy.endDate" type="date" required />
          </div>
          <div>
            <AppInput v-model="dataProxy.endTime" type="time" required />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
import AppLabel from '../../../forms/AppLabel.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { DateAndDurationStepProps } from '../callouts.interface';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: DateAndDurationStepProps;
  mode: 'new' | 'edit';
}>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.dates.inputs.' + key);

const dataProxy = ref(props.data);

const validation = useVuelidate();

watch(
  validation,
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit('update:validated', !validation.value.$invalid);
  },
  { immediate: true }
);
</script>
