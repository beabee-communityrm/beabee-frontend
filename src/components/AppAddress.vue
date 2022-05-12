<template>
  <div class="mb-3">
    <AppInput
      :model-value="line1"
      input-type="text"
      :label="t('form.addressLine1')"
      :error-message="errorGenerator(addressValidation, 'line1')"
      :required="isAddressRequired"
      @update:modelValue="$emit('update:line1', $event)"
      @blur="addressValidation.line1.$touch"
    />
  </div>

  <div class="mb-3">
    <AppInput
      :model-value="line2"
      input-type="text"
      :label="t('form.addressLine2')"
      @update:modelValue="$emit('update:line2', $event)"
      @blur="addressValidation.line2.$touch"
    />
  </div>

  <div class="grid grid-cols-6 gap-4">
    <div class="mb-3 col-span-4">
      <AppInput
        :model-value="cityOrTown"
        input-type="text"
        :label="t('form.cityOrTown')"
        :error-message="errorGenerator(addressValidation, 'cityOrTown')"
        :required="isAddressRequired"
        @update:modelValue="$emit('update:cityOrTown', $event)"
        @blur="addressValidation.cityOrTown.$touch"
      />
    </div>

    <div class="mb-3 col-span-2">
      <AppInput
        :model-value="postCode"
        input-type="text"
        :label="t('form.postCode')"
        :error-message="errorGenerator(addressValidation, 'postCode')"
        :required="isAddressRequired"
        @update:modelValue="$emit('update:postCode', $event)"
        @blur="addressValidation.postCode.$touch"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { errorGenerator } from '../utils/form-error-generator';
import AppInput from './forms/AppInput.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { helpers, requiredIf } from '@vuelidate/validators';
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
  isAddressRequired: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  'update:line1',
  'update:line2',
  'update:cityOrTown',
  'update:postCode',
]);

const addressFieldError = t('form.errors.address.required');

const hasAddress = computed(
  () => !!(props.line1 || props.line2 || props.cityOrTown || props.postCode)
);

const rules = computed(() => ({
  line1: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(props.isAddressRequired || hasAddress.value)
    ),
  },
  // no validation is needed for this field
  // but it should be present for 'addressValidation.line2.$touch'
  line2: {},
  cityOrTown: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(props.isAddressRequired || hasAddress.value)
    ),
  },

  postCode: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(props.isAddressRequired || hasAddress.value)
    ),
  },
}));

const addressValidation = useVuelidate(rules, props);
</script>
