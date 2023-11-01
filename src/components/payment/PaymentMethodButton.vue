<template>
  <button
    class="h-full min-h-[2.5rem] w-full cursor-pointer rounded border p-1.5 text-left text-lg font-semibold"
    :class="
      selected
        ? 'border-link-110 bg-link text-white'
        : 'border-primary-40 bg-white hover:border-link hover:bg-link-10'
    "
    type="button"
  >
    <PaymentMethodIcon :method="method" /><span
      class="text-xs"
      :class="small ? 'm-2 inline' : 'block'"
      >{{ t(`paymentMethods.${method}.label`) }}</span
    >
  </button>
</template>
<script lang="ts" setup>
import { PaymentMethod } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import PaymentMethodIcon from './PaymentMethodIcon.vue';

defineProps<{
  method: PaymentMethod;
  selected?: boolean;
  small?: boolean;
}>();

const { t } = useI18n();
</script>
