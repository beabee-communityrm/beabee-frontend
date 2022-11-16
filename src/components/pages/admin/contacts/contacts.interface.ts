import {
  ContributionPeriod,
  NewsletterStatus,
  ContributionType,
  ContactFilterName,
  contactFilters,
} from '@beabee/beabee-common';
import { computed, ComputedRef } from 'vue';

import i18n from '../../../../i18n';
import { generalContent } from '../../../../store';
import {
  FilterGroup,
  FilterItems,
  withLabel,
} from '../../../search/search.interface';

const { t } = i18n.global;

export const filterGroups: ComputedRef<FilterGroup<ContactFilterName>[]> =
  computed(() => [
    {
      label: t('contacts.dataGroup.contact'),
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
      label: t('contacts.dataGroup.contribution'),
      items: [
        'contributionType',
        'contributionMonthlyAmount',
        'contributionPeriod',
        'contributionCancelled',
        'manualPaymentSource',
      ],
    },
    {
      label: t('contacts.dataGroup.role'),
      items: [
        'activePermission',
        'activeMembership',
        'membershipStarts',
        'membershipExpires',
      ],
    },
  ]);

export const filterItems: ComputedRef<FilterItems<ContactFilterName>> =
  computed(() => ({
    firstname: withLabel(
      contactFilters.firstname,
      t('contacts.data.firstname')
    ),
    lastname: withLabel(contactFilters.lastname, t('contacts.data.lastname')),
    email: withLabel(contactFilters.email, t('contacts.data.email')),
    joined: withLabel(contactFilters.joined, t('contacts.data.joined')),
    newsletterStatus: withLabel(
      contactFilters.newsletterStatus,
      t('contacts.data.newsletterStatus'),
      {
        [NewsletterStatus.Subscribed]: t('common.newsletterStatus.subscribed'),
        [NewsletterStatus.Unsubscribed]: t(
          'common.newsletterStatus.unsubscribed'
        ),
        [NewsletterStatus.Cleaned]: t('common.newsletterStatus.cleaned'),
        [NewsletterStatus.None]: t('common.newsletterStatus.none'),
      }
    ),
    tags: withLabel(contactFilters.tags, t('contacts.data.tags')),
    deliveryOptIn: withLabel(
      contactFilters.deliveryOptIn,
      t('contacts.data.deliveryOptIn')
    ),
    contributionCancelled: withLabel(
      contactFilters.contributionCancelled,
      t('contacts.data.contributionCancelled')
    ),
    contributionType: withLabel(
      contactFilters.contributionType,
      t('contacts.data.contributionType'),
      {
        [ContributionType.Automatic]: t('common.contributionType.automatic'),
        [ContributionType.Manual]: t('common.contributionType.manual'),
        [ContributionType.None]: t('common.contributionType.none'),
        [ContributionType.Gift]: t('common.contributionType.gift'),
      }
    ),
    contributionMonthlyAmount: withLabel(
      contactFilters.contributionMonthlyAmount,
      t('contacts.data.contributionMonthlyAmount'),
      generalContent.value.currencySymbol
    ),
    contributionPeriod: withLabel(
      contactFilters.contributionPeriod,
      t('contacts.data.contributionPeriod'),
      {
        [ContributionPeriod.Monthly]: t('common.monthly'),
        [ContributionPeriod.Annually]: t('common.annually'),
      }
    ),
    manualPaymentSource: withLabel(
      contactFilters.manualPaymentSource,
      t('contacts.data.manualPaymentSource')
    ),
    activePermission: withLabel(
      contactFilters.activePermission,
      t('contacts.data.activePermission'),
      {
        member: t('common.role.member'),
        admin: t('common.role.admin'),
        superadmin: t('common.role.superadmin'),
      }
    ),
    activeMembership: withLabel(
      contactFilters.activeMembership,
      t('contacts.data.activeMembership')
    ),
    membershipStarts: withLabel(
      contactFilters.membershipStarts,
      t('contacts.data.membershipStarts')
    ),
    membershipExpires: withLabel(
      contactFilters.membershipExpires,
      t('contacts.data.membershipExpires')
    ),
  }));
