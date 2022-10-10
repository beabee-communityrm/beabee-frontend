import { computed, Ref } from 'vue';
import i18n from '../../../../i18n';
import { Filters } from '../../../search/search.interface';

const { t } = i18n.global;

export const filters: Ref<Filters> = computed(() => ({
  firstname: {
    type: 'text',
    label: t('contacts.data.firstname'),
  },
  lastname: {
    type: 'text',
    label: t('contacts.data.lastname'),
  },
  email: {
    type: 'text',
    label: t('contacts.data.email'),
  },
  joined: {
    type: 'date',
    label: t('contacts.data.joined'),
  },
  contributionType: {
    type: 'enum',
    options: ['Automatic', 'Gift', 'Manual', 'None'],
    label: t('contacts.data.contributionType'),
  },
  contributionMonthlyAmount: {
    type: 'number',
    label: t('contacts.data.contributionMonthlyAmount'),
  },
  contributionPeriod: {
    type: 'enum',
    options: ['monthly', 'annual'],
    label: t('contacts.data.contributionPeriod'),
  },
  deliveryOptIn: {
    type: 'boolean',
    label: t('contacts.data.deliveryOptIn'),
  },
  newsletterStatus: {
    type: 'text',
    label: t('contacts.data.newsletterStatus'),
  },
  activePermission: {
    type: 'enum',
    options: ['member', 'admin', 'superadmin'],
    label: t('contacts.data.activePermission'),
  },
  activeMembership: {
    type: 'boolean',
    label: t('contacts.data.activeMembership'),
  },
  membershipStarts: {
    type: 'date',
    label: t('contacts.data.membershipStarts'),
  },
  membershipExpires: {
    type: 'date',
    label: t('contacts.data.membershipExpires'),
  },
  manualPaymentSource: {
    type: 'text',
    label: t('contacts.data.manualPaymentSource'),
  },
  tags: {
    type: 'array',
    label: t('contacts.data.tags'),
  },
}));
