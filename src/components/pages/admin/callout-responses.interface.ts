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
    value: 'number',
    text: t('calloutResponsesPage.response'),
    sortable: true,
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
      items: ['createdAt', 'tags'],
    },
  ]
);

export const filterItems = computed<FilterItems<CalloutResponseFilterName>>(
  () => ({
    id: withLabel(calloutResponseFilters.id, ''),
    createdAt: withLabel(
      calloutResponseFilters.createdAt,
      t('calloutResponse.data.createdAt')
    ),
    updatedAt: withLabel(
      calloutResponseFilters.updatedAt,
      t('calloutResponse.data.updatedAt')
    ),
    bucket: withLabel(
      calloutResponseFilters.bucket,
      t('calloutResponse.data.bucket')
    ),
    tags: withLabel(
      calloutResponseFilters.tags,
      t('calloutResponse.data.tags')
    ),
    callout: withLabel(
      calloutResponseFilters.callout,
      t('calloutResponse.data.callout')
    ),
    contact: withLabel(
      calloutResponseFilters.contact,
      t('calloutResponse.data.contact')
    ),
  })
);
