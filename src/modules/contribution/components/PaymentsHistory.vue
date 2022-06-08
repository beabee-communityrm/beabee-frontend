<template>
  <div v-if="paymentsHistoryTable.total > 0">
    <SectionTitle class="mb-2">{{
      t('contribution.paymentHistory.title')
    }}</SectionTitle>
    <AppTable
      :sort="{ by: 'chargeDate', type: SortType.Desc }"
      :headers="headers"
      :items="paymentsHistoryTable.items"
      :hide-headers="true"
      class="w-full"
    >
      <template #empty>
        <p>{{ t('contribution.paymentHistory.empty') }}</p>
      </template>
      <template #chargeDate="{ value }">
        {{ formatLocale(value, 'PPP') }}
      </template>
      <template #amount="{ value }"
        ><b>{{ n(value, 'currency') }}</b></template
      >
    </AppTable>
    <div class="flex w-full justify-center">
      <AppPagination
        v-model="currentPage"
        :total-pages="totalPages"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, ref, watchEffect } from 'vue';

import AppTable from '../../../components/table/AppTable.vue';
import SectionTitle from '../../../components/SectionTitle.vue';
import AppPagination from '../../../components/AppPagination.vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';

import { fetchPayments } from '../../../utils/api/member';
import { Paginated } from '../../../utils/api/api.interface';
import { GetPaymentData } from '../../../utils/api/api.interface';
import { Header, SortType } from '../../../components/table/table.interface';

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
  { value: 'chargeDate', text: t('contribution.paymentHistory.date') },
  {
    value: 'amount',
    text: t('contribution.paymentHistory.amount'),
    align: 'right',
  },
];

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
