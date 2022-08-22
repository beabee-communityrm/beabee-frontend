<template>
  <div>
    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-if="mode === 'new'"
          v-model="dataProxy.startNow"
          name="calloutStartDate"
          :label="inputT('starts.label')"
          :options="[
            [true, inputT('starts.opts.now')],
            [false, inputT('starts.opts.schedule')],
          ]"
        />
        <AppInput
          v-if="!dataProxy.startNow || mode === 'edit'"
          v-model="dataProxy.startDate"
          :label="mode === 'edit' ? inputT('starts.label') : undefined"
          type="date"
          required
        />
      </div>
      <div class="col-span-1 text-sm text-grey mt-6" />
    </div>
    <div class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="dataProxy.hasEndDate"
          name="calloutEndDate"
          :label="inputT('expires.label')"
          :options="[
            [false, inputT('expires.opts.never')],
            [true, inputT('expires.opts.schedule')],
          ]"
        />
        <AppInput
          v-if="dataProxy.hasEndDate"
          v-model="dataProxy.endDate"
          type="date"
          required
          :min="dataProxy.startDate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
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
