import {
  CalloutResponseFilterName,
  calloutResponseFilters,
} from '@beabee/beabee-common';
import { computed } from 'vue';
import i18n from '../../../lib/i18n';
import {
  FilterGroup,
  FilterItems,
  withLabel,
} from '../../search/search.interface';
import { Header } from '../../table/table.interface';

const { t } = i18n.global;

export const headers = computed<Header[]>(() => [
  {
    value: 'response',
    text: t('calloutResponsesPage.response'),
  },
  {
    value: 'contact',
    text: t('calloutResponse.data.contact'),
  },
  {
    value: 'tags',
    text: t('calloutResponse.data.tags'),
  },
  {
    value: 'createdAt',
    text: t('calloutResponse.data.createdAt'),
    sortable: true,
    align: 'right',
  },
]);

export const filterGroups = computed<FilterGroup<CalloutResponseFilterName>[]>(
  () => [
    {
      label: t('calloutResponse.dataGroup.response'),
      items: ['createdAt'],
    },
  ]
);

export const filterItems = computed<FilterItems<CalloutResponseFilterName>>(
  () => ({
    createdAt: withLabel(
      calloutResponseFilters.createdAt,
      t('calloutResponse.data.createdAt')
    ),
    updatedAt: withLabel(
      calloutResponseFilters.updatedAt,
      t('calloutResponse.data.updatedAt')
    ),
    callout: withLabel(
      calloutResponseFilters.callout,
      t('calloutResponse.data.callout')
    ),
    contact: withLabel(
      calloutResponseFilters.contact,
      t('calloutResponse.data.contact')
    ),
    answers: withLabel(
      calloutResponseFilters.answers,
      t('calloutResponse.data.answers')
    ),
  })
);
