<template>
  <div class="mb-5">
    <AppInput
      :model-value="line1"
      input-type="text"
      :label="t('form.addressLine1')"
      :error-message="errorGenerator(addressValidation, 'line1')"
      @update:modelValue="$emit('update:line1', $event)"
    />
  </div>

  <div class="mb-5">
    <AppInput
      :model-value="line2"
      input-type="text"
      :label="t('form.addressLine2')"
      @update:modelValue="$emit('update:line2', $event)"
    />
  </div>

  <div class="grid grid-cols-6 gap-4">
    <div class="mb-5 col-span-4">
      <AppInput
        :model-value="cityOrTown"
        input-type="text"
        :label="t('form.cityOrTown')"
        :error-message="errorGenerator(addressValidation, 'cityOrTown')"
        @update:modelValue="$emit('update:cityOrTown', $event)"
      />
    </div>

    <div class="mb-5 col-span-2">
      <AppInput
        :model-value="postCode"
        input-type="text"
        :label="t('form.postCode')"
        :error-message="errorGenerator(addressValidation, 'postCode')"
        @update:modelValue="$emit('update:postCode', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { errorGenerator } from '../utils/form-error-generator';
import AppInput from './forms/AppInput.vue';
import { useI18n } from 'vue-i18n';
import { helpers, requiredIf } from '@vuelidate/validators';
import { computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';

const { t } = useI18n();

const props = defineProps({
  line1: {
    type: String,
    default: '',
  },
  line2: {
    type: String,
    default: '',
  },
  cityOrTown: {
    type: String,
    default: '',
  },
  postCode: {
    type: String,
    default: '',
  },
  addressValidation: {
    type: Object,
    default: () => ({}),
  },
  isAddressRequired: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits([
  'update:line1',
  'update:line2',
  'update:cityOrTown',
  'update:postCode',
  'update:addressValidation',
]);

const addressFieldError = t('form.errors.address.required');

const rules = computed(() => ({
  line1: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(
        props.isAddressRequired ||
          props.postCode ||
          props.cityOrTown ||
          props.line2
      )
    ),
  },
  // no validation is needed for this field
  // but it should be present for 'addressValidation.line2.$touch'
  line2: {},
  cityOrTown: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(
        props.isAddressRequired || props.line1 || props.line2 || props.postCode
      )
    ),
  },

  postCode: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(
        props.isAddressRequired ||
          props.line1 ||
          props.line2 ||
          props.cityOrTown
      )
    ),
  },
}));

const addressValidation = useVuelidate(rules, props);

watch(
  () => addressValidation.value,
  (addressValidation) => {
    emits('update:addressValidation', addressValidation);
  },
  { immediate: true }
);
</script>
