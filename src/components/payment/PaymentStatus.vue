<template>
  <span class="text-sm font-bold uppercase" :class="color[status]">{{
    t('common.paymentStatus.' + status)
  }}</span>
</template>
<script lang="ts" setup>
import { PaymentStatus } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const color = {
  pending: 'text-body-60',
  successful: 'text-success',
  cancelled: 'text-danger',
  failed: 'text-danger',
};
defineProps<{
  status: PaymentStatus;
}>();
</script>
