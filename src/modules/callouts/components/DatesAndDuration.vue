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
        required
        :error-message="validation.callout_start_date.$errors[0]?.$message"
        @blur="validation.callout_start_date.$touch"
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
          required
          :error-message="validation.callout_end_date.$errors[0]?.$message"
          @blur="validation.callout_end_date.$touch"
        ></AppInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
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

const rules = computed(() => ({
  callout_start_date: { required },
  callout_end_date: {
    minValue: (value: string) => {
      return (
        !dataProxy.value.calloutHasEndDate ||
        value >= dataProxy.value.callout_start_date
      );
    },
  },
}));

const dataProxy = ref(props.data);

const validation = useVuelidate(rules, dataProxy);

watch(validation, () => emit('update:validated', !validation.value.$invalid));
</script>
