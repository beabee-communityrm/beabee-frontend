import {
  ContributionPeriod,
  NewsletterStatus,
  ContributionType,
  ContactFilterName,
  contactFilters,
} from '@beabee/beabee-common';
import { computed, Ref } from 'vue';

import i18n from '../../../../i18n';
import { generalContent } from '../../../../store';
import { FilterGroup, FilterItems } from '../../../search/search.interface';

const { t } = i18n.global;

export const filters = contactFilters;

export const filterGroups: Ref<FilterGroup<ContactFilterName>[]> = computed(
  () => [
    {
      label: 'Contact',
      items: [
        'firstname',
        'lastname',
        'email',
        'joined',
        'newsletterStatus',
        'tags',
        'deliveryOptIn',
      ],
    },
    {
      label: 'Contribution',
      items: [
        'contributionType',
        'contributionMonthlyAmount',
        'contributionPeriod',
        'manualPaymentSource',
      ],
    },
    {
      label: 'Role',
      items: [
        'activePermission',
        'activeMembership',
        'membershipStarts',
        'membershipExpires',
      ],
    },
  ]
);

export const filterItems: FilterItems<ContactFilterName> = {
  firstname: { label: t('contacts.data.firstname') },
  lastname: { label: t('contacts.data.lastname') },
  email: { label: t('contacts.data.email') },
  joined: { label: t('contacts.data.joined') },
  newsletterStatus: {
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
      {
        id: NewsletterStatus.None,
        label: t('common.newsletterStatus.none'),
      },
    ],
  },
  tags: { label: t('contacts.data.tags') },
  deliveryOptIn: {
    label: t('contacts.data.deliveryOptIn'),
  },
  contributionType: {
    label: t('contacts.data.contributionType'),
    options: [
      {
        id: ContributionType.Automatic,
        label: t('common.contributionType.automatic'),
      },
      {
        id: ContributionType.Manual,
        label: t('common.contributionType.manual'),
      },
      {
        id: ContributionType.None,
        label: t('common.contributionType.none'),
      },
      {
        id: ContributionType.Gift,
        label: t('common.contributionType.gift'),
      },
    ],
  },
  contributionMonthlyAmount: {
    label: t('contacts.data.contributionMonthlyAmount'),
    prefix: generalContent.value.currencySymbol,
  },
  contributionPeriod: {
    label: t('contacts.data.contributionPeriod'),
    options: [
      { id: ContributionPeriod.Monthly, label: t('common.monthly') },
      { id: ContributionPeriod.Annually, label: t('common.annually') },
    ],
  },
  manualPaymentSource: {
    label: t('contacts.data.manualPaymentSource'),
  },
  activePermission: {
    label: t('contacts.data.activePermission'),
    options: [
      { id: 'member', label: t('common.role.member') },
      { id: 'admin', label: t('common.role.admin') },
      { id: 'superadmin', label: t('common.role.superadmin') },
    ],
  },
  activeMembership: {
    label: t('contacts.data.activeMembership'),
  },
  membershipStarts: {
    label: t('contacts.data.membershipStarts'),
  },
  membershipExpires: {
    label: t('contacts.data.membershipExpires'),
  },
};
