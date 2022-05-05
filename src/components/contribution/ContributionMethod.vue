<template>
  <AppRadioGroup
    v-model="paymentMethod"
    name="paymentMethod"
    :options="[
      [PaymentMethod.Card, 'Card'],
      [PaymentMethod.DirectDebit, 'Direct debit'],
    ]"
  />
  <div></div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { PaymentMethod } from '../../utils/enums/payment-method.enum';
import AppRadioGroup from '../forms/AppRadioGroup.vue';

PaymentMethod;

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: PaymentMethod;
}>();

const paymentMethod = computed({
  get: () => props.modelValue,
  set: (newPaymentMethod) => emit('update:modelValue', newPaymentMethod),
});
</script>
