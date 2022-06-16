<template>
  <component :is="icons[method]" />
</template>

<script lang="ts" setup>
import { PaymentMethod } from '../../utils/enums/payment-method.enum';
import Card from './icons/Card.vue';
import DirectDebit from './icons/DirectDebit.vue';
import SEPA from './icons/SEPA.vue';

defineProps<{ method: PaymentMethod }>();

const icons = {
  [PaymentMethod.StripeCard]: Card,
  [PaymentMethod.StripeSEPA]: SEPA,
  [PaymentMethod.StripeBACS]: DirectDebit,
  [PaymentMethod.GoCardlessDirectDebit]: DirectDebit,
};
</script>
