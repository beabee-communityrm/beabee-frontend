<template>
  <div v-if="source.method">
    <PaymentMethodIcon :method="source.method" />
    {{ description }}
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { PaymentMethod } from '@beabee/beabee-common';

import PaymentMethodIcon from './PaymentMethodIcon.vue';

import type { PaymentSource } from '@type';

const props = defineProps<{ source: PaymentSource }>();

const description = computed(() => {
  const source = props.source;
  switch (source.method) {
    case PaymentMethod.StripeCard:
      return `•••• •••• •••• ${source.last4}, ${String(
        source.expiryMonth
      ).padStart(2, '0')}/${source.expiryYear}`;
    case PaymentMethod.StripeBACS:
      return `${source.sortCode} ••••••••••${source.last4}`;
    case PaymentMethod.StripeSEPA:
      return `${source.country}••${source.bankCode}${source.branchCode}••••${source.last4}`;
    case PaymentMethod.GoCardlessDirectDebit:
      return `${source.accountHolderName}, ${source.bankName}, ••••••••••${source.accountNumberEnding}`;
    default:
      return '';
  }
});
</script>
