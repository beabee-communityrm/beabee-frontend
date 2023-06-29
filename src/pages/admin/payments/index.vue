<route lang="yaml">
name: adminPayments
meta:
  role: admin
  pageTitle: menu.payments
</route>

<template>
  <PageTitle :title="t('menu.payments')" border>
    <div class="flex-1 md:hidden">
      <AppSelect v-model="currentStatus" :items="statusItems" />
    </div>
  </PageTitle>

  <div class="md:flex">
    <div class="hidden flex-none basis-[220px] md:block">
      <AppVTabs v-model="currentStatus" :items="statusItems" />
    </div>
    <div class="flex-auto">
      <AppPaginatedTable
        v-model:query="currentPaginatedQuery"
        keypath="paymentsAdmin.showingOf"
        :headers="headers"
        :result="paymentsTable"
      >
        <template #value-status="{ value }">
          <PaymentStatus :status="value" />
        </template>
        <template #value-contact="{ value }">
          <router-link
            :to="'/admin/contacts/' + value.id"
            class="text-base font-bold text-link"
          >
            {{ value.displayName }}
          </router-link>
        </template>
        <template #value-chargeDate="{ value }">
          <span class="whitespace-nowrap">{{ formatLocale(value, 'PP') }}</span>
        </template>
        <template #value-amount="{ value }">
          {{ n(value, 'currency') }}
        </template>
      </AppPaginatedTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import { computed, ref, watchEffect } from 'vue';
import { addBreadcrumb } from '../../../store/breadcrumb';
import PageTitle from '../../../components/PageTitle.vue';
import { faEuro } from '@fortawesome/free-solid-svg-icons';
import { Header } from '../../../components/table/table.interface';
import { definePaginatedQuery, defineParam } from '../../../utils/pagination';
import {
  GetPaymentDataWith,
  GetPaymentsQuery,
} from '../../../utils/api/api.interface';
import { fetchPayments } from '../../../utils/api/payment';
import AppPaginatedTable from '../../../components/table/AppPaginatedTable.vue';
import { formatLocale } from '../../../utils/dates';
import PaymentStatus from '../../../components/payment/PaymentStatus.vue';
import AppVTabs from '../../../components/tabs/AppVTabs.vue';
import AppSelect from '../../../components/forms/AppSelect.vue';

const { t, n } = useI18n();

addBreadcrumb(computed(() => [{ title: t('menu.payments'), icon: faEuro }]));

const statusItems = [
  { id: '', label: t('paymentsAdmin.filter.all'), to: '/admin/payments' },
  {
    id: 'successful',
    label: t('paymentsAdmin.filter.successful'),
    to: '/admin/payments?status=successful',
  },
  {
    id: 'pending',
    label: t('paymentsAdmin.filter.pending'),
    to: '/admin/payments?status=pending',
  },
  {
    id: 'failed',
    label: t('paymentsAdmin.filter.failed'),
    to: '/admin/payments?status=failed',
  },
  {
    id: 'cancelled',
    label: t('paymentsAdmin.filter.cancelled'),
    to: '/admin/payments?status=cancelled',
  },
];

const headers: Header[] = [
  {
    value: 'status',
    text: t('payments.data.status'),
  },
  {
    value: 'contact',
    text: t('payments.data.contact'),
    width: '100%',
  },
  {
    value: 'chargeDate',
    text: t('payments.data.chargeDate'),
    align: 'right',
    sortable: true,
  },
  {
    value: 'amount',
    text: t('payments.data.amount'),
    align: 'right',
    sortable: true,
  },
];

const currentStatus = defineParam('status', (v) => v || '');
const currentPaginatedQuery = definePaginatedQuery('chargeDate');
const paymentsTable = ref<Paginated<GetPaymentDataWith<'contact'>>>();

watchEffect(async () => {
  const rules: GetPaymentsQuery['rules'] | undefined = currentStatus.value
    ? {
        condition: 'AND',
        rules: [
          {
            field: 'status',
            operator: 'equal' as const,
            value: [currentStatus.value],
          },
        ],
      }
    : undefined;

  paymentsTable.value = await fetchPayments(
    {
      ...currentPaginatedQuery.query,
      rules,
    },
    ['contact']
  );
});
</script>
