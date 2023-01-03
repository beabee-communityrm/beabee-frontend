<template>
  <div v-if="paymentsHistoryTable.total > 0">
    <AppHeading class="mb-2">{{
      t('contribution.paymentHistory.title')
    }}</AppHeading>
    <AppTable
      :sort="{ by: 'chargeDate', type: SortType.Desc }"
      :headers="headers"
      :items="paymentsHistoryTable.items"
      :row-class="getRowClass"
      hide-headers
      class="w-full"
    >
      <template #chargeDate="{ value }">
        {{ formatLocale(value, 'PPP') }}
      </template>
      <template #amount="{ value, item }">
        <span class="mr-3">
          {{ getStatusText(item) }}
        </span>
        <b>{{ n(value, 'currency') }}</b>
      </template>
    </AppTable>
    <div v-if="totalPages > 1" class="flex w-full justify-center">
      <AppPagination
        v-model="currentPage"
        :total-pages="totalPages"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Paginated, PaymentStatus } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import { computed, ref, watchEffect } from 'vue';

import AppTable from '../table/AppTable.vue';
import AppPagination from '../AppPagination.vue';
import { formatLocale } from '../../utils/dates/locale-date-formats';

import { fetchPayments } from '../../utils/api/contact';
import { GetPaymentData } from '../../utils/api/api.interface';
import { Header, SortType } from '../table/table.interface';
import AppHeading from '../AppHeading.vue';

const { t, n } = useI18n();

const props = defineProps<{
  id: string;
}>();

const paymentsHistoryTable = ref<Paginated<GetPaymentData>>({
  items: [],
  offset: 0,
  count: 0,
  total: 0,
});
const pageSize = 12;
const currentPage = ref(0);
const totalPages = computed(() =>
  Math.ceil(paymentsHistoryTable.value.total / pageSize)
);

const headers: Header[] = [
  { value: 'chargeDate', text: '' },
  { value: 'amount', text: '', align: 'right' },
];

function getRowClass(item: GetPaymentData) {
  switch (item.status) {
    case PaymentStatus.Cancelled:
    case PaymentStatus.Failed:
      return 'text-danger';
    case PaymentStatus.Pending:
      return 'text-body-60';
    default:
      return '';
  }
}

function getStatusText(item: GetPaymentData) {
  switch (item.status) {
    case PaymentStatus.Cancelled:
      return t('contribution.paymentHistory.status.cancelled');
    case PaymentStatus.Failed:
      return t('contribution.paymentHistory.status.failed');
    case PaymentStatus.Pending:
      return t('contribution.paymentHistory.status.pending');
  }
}

watchEffect(async () => {
  const query = {
    offset: currentPage.value * pageSize,
    limit: pageSize,
    sort: 'chargeDate',
    order: SortType.Desc,
  };
  paymentsHistoryTable.value = await fetchPayments(props.id, query);
});
</script>
