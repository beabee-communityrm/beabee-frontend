import { computed } from 'vue';
import i18n from '../../../lib/i18n';
import { type Header } from '../../table/table.interface';
import type { FilterGroups, FilterItems } from '@type';
import { type PaymentFilterName, paymentFilters } from '@beabee/beabee-common';
import { withItems, withLabel } from '@utils/rules';

const { t } = i18n.global;

export const statusItems = computed(() => [
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
]);

export const headers = computed<Header[]>(() => [
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
]);

const filterItems = computed<FilterItems<PaymentFilterName>>(() => ({
  id: withLabel(paymentFilters.id, t('payments.data.id')),
  chargeDate: withLabel(
    paymentFilters.chargeDate,
    t('payments.data.chargeDate')
  ),
  contact: withLabel(paymentFilters.contact, t('payments.data.contact')),
  amount: withLabel(paymentFilters.amount, t('payments.data.amount')),
  status: withLabel(paymentFilters.status, t('payments.data.status'), {
    successful: t('common.paymentStatus.successful'),
    pending: t('common.paymentStatus.pending'),
    failed: t('common.paymentStatus.failed'),
    cancelled: t('common.paymentStatus.cancelled'),
  }),
}));

export const filterGroups = computed<FilterGroups>(() => [
  {
    id: 'payment',
    label: t('payments.dataGroup.payment'),
    items: withItems(filterItems, ['amount', 'chargeDate']),
  },
]);
