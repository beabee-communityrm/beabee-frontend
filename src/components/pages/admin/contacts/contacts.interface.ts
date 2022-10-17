import { computed, Ref } from 'vue';
import i18n from '../../../../i18n';
import { generalContent } from '../../../../store';

import { ContributionPeriod, NewsletterStatus } from '@beabee/beabee-common';

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
    label: t('contacts.data.contributionType'),
    options: ['Automatic', 'Gift', 'Manual', 'None'].map((id) => ({
      id,
      label: id,
    })),
  },
  contributionMonthlyAmount: {
    type: 'number',
    label: t('contacts.data.contributionMonthlyAmount'),
    prefix: generalContent.value.currencySymbol,
  },
  contributionPeriod: {
    type: 'enum',
    options: [
      { id: ContributionPeriod.Monthly, label: t('common.monthly') },
      { id: ContributionPeriod.Annually, label: t('common.annually') },
    ],
    label: t('contacts.data.contributionPeriod'),
  },
  deliveryOptIn: {
    type: 'boolean',
    label: t('contacts.data.deliveryOptIn'),
  },
  newsletterStatus: {
    type: 'enum',
    label: t('contacts.data.newsletterStatus'),
    options: [
      {
        id: NewsletterStatus.Subscribed,
        label: t('common.newsletterStatus.subscribed'),
      },
      {
        id: NewsletterStatus.Unsubscribed,
        label: t('common.newsletterStatus.unsubscribed'),
      },
      {
        id: NewsletterStatus.Cleaned,
        label: t('common.newsletterStatus.cleaned'),
      },
      { id: NewsletterStatus.None, label: t('common.newsletterStatus.none') },
    ],
  },
  activePermission: {
    type: 'enum',
    options: [
      { id: 'member', label: t('common.role.member') },
      { id: 'admin', label: t('common.role.admin') },
      { id: 'superadmin', label: t('common.role.superadmin') },
    ],
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
    nullable: true,
  },
  tags: {
    type: 'array',
    label: t('contacts.data.tags'),
    nullable: true,
  },
}));
