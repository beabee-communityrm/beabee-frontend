import {
  type CalloutResponseFilterName,
  calloutResponseFilters,
} from '@beabee/beabee-common';
import { computed } from 'vue';
import i18n from '../../../lib/i18n';
import { type Header } from '../../table/table.interface';

import type { FilterGroups, FilterItems } from '@type';
import { withItems, withLabel } from '@utils/rules';

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
    value: 'assignee',
    text: t('calloutResponse.data.assignee'),
  },
  {
    value: 'createdAt',
    text: t('calloutResponse.data.createdAt'),
    sortable: true,
    align: 'right',
  },
]);

const filterItems = computed<FilterItems<CalloutResponseFilterName>>(() => ({
  id: withLabel(calloutResponseFilters.id, ''),
  calloutId: withLabel(
    calloutResponseFilters.calloutId,
    t('calloutResponse.data.callout')
  ),
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
  tags: withLabel(calloutResponseFilters.tags, t('calloutResponse.data.tags')),
  contact: withLabel(
    calloutResponseFilters.contact,
    t('calloutResponse.data.contact')
  ),
  assignee: withLabel(
    calloutResponseFilters.assignee,
    t('calloutResponse.data.assignee')
  ),
  answers: withLabel(
    calloutResponseFilters.answers,
    t('calloutResponse.data.answers')
  ),
}));

export const filterGroups = computed<FilterGroups>(() => [
  {
    id: 'response',
    label: t('calloutResponse.dataGroup.response'),
    items: withItems(filterItems, ['createdAt', 'tags', 'answers']),
  },
]);
