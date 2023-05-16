<route lang="yaml">
name: adminCallouts
meta:
  pageTitle: menu.callouts
  role: admin
</route>
<template>
  <PageTitle :title="t('menu.callouts')" border>
    <div class="block flex-1 lg:hidden">
      <AppSelect v-model="currentStatus" :items="statusItems" />
    </div>
    <div class="flex-0 ml-3">
      <AppButton to="/admin/callouts/new">{{
        t('calloutsAdmin.addCallout')
      }}</AppButton>
    </div>
  </PageTitle>

  <div class="md:flex">
    <div class="hidden flex-none basis-[220px] lg:block">
      <AppVTabs v-model="currentStatus" :items="statusItems" />
    </div>
    <div class="flex-auto">
      <div class="flex">
        <AppSearchInput
          v-model="currentSearch"
          :placeholder="t('callouts.search')"
        />
      </div>
      <AppPaginatedTable
        v-model:query="currentPaginatedQuery"
        keypath="callouts.showingOf"
        :headers="headers"
        :result="calloutsTable"
      >
        <template #header-hidden><font-awesome-icon :icon="faEye" /></template>
        <template #value-status="{ value }">
          <AppItemStatus :status="value" />
        </template>
        <template #value-title="{ item, value }">
          <router-link
            :to="'/admin/callouts/view/' + item.slug"
            class="text-base font-bold text-link"
          >
            {{ value }}
          </router-link>
        </template>
        <template #value-hidden="{ value }">
          <font-awesome-icon
            :class="value ? 'text-body-60' : 'text-body-80'"
            :icon="value ? faEyeSlash : faEye"
          />
        </template>
        <template #value-starts="{ value }">
          <span class="whitespace-nowrap">{{
            value && formatLocale(value, 'PP')
          }}</span>
        </template>
        <template #value-expires="{ value }">
          <span class="whitespace-nowrap">{{
            value && formatLocale(value, 'PP')
          }}</span>
        </template>
      </AppPaginatedTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { Header } from '../../../components/table/table.interface';
import AppButton from '../../../components/button/AppButton.vue';
import PageTitle from '../../../components/PageTitle.vue';
import AppItemStatus from '../../../components/AppItemStatus.vue';
import {
  GetCalloutDataWith,
  GetCalloutsQuery,
} from '../../../utils/api/api.interface';
import { formatLocale } from '../../../utils/dates';
import { fetchCallouts } from '../../../utils/api/callout';

import AppSelect from '../../../components/forms/AppSelect.vue';
import AppSearchInput from '../../../components/forms/AppSearchInput.vue';
import AppVTabs from '../../../components/tabs/AppVTabs.vue';
import { addBreadcrumb } from '../../../store/breadcrumb';
import { definePaginatedQuery, defineParam } from '../../../utils/pagination';
import AppPaginatedTable from '../../../components/table/AppPaginatedTable.vue';
import {
  faBullhorn,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

const { t } = useI18n();

addBreadcrumb(
  computed(() => [
    {
      title: t('menu.callouts'),
      icon: faBullhorn,
      to: '/admin/callouts',
    },
  ])
);

const statusItems = [
  {
    id: '',
    label: t('calloutsAdmin.filter.all'),
    to: '/admin/callouts',
  },
  {
    id: 'open',
    label: t('calloutsAdmin.filter.open'),
    to: '/admin/callouts?filter=open',
  },
  {
    id: 'scheduled',
    label: t('calloutsAdmin.filter.scheduled'),
    to: '/admin/callouts?filter=scheduled',
  },
  {
    id: 'ended',
    label: t('calloutsAdmin.filter.ended'),
    to: '/admin/callouts?filter=ended',
  },
  {
    id: 'draft',
    label: t('calloutsAdmin.filter.draft'),
    to: '/admin/callouts?filter=draft',
  },
];

const headers: Header[] = [
  {
    value: 'status',
    text: t('calloutsAdmin.data.status'),
  },
  {
    value: 'title',
    text: t('calloutsAdmin.data.title'),
    sortable: true,
    width: '100%',
  },
  {
    value: 'hidden',
    text: '',
  },
  {
    value: 'responseCount',
    text: t('calloutsAdmin.data.responses'),
    align: 'right',
  },
  {
    value: 'starts',
    text: t('calloutsAdmin.data.starts'),
    align: 'right',
    sortable: true,
  },
  {
    value: 'expires',
    text: t('calloutsAdmin.data.expires'),
    align: 'right',
    sortable: true,
  },
];

const currentSearch = defineParam('s', (v) => v || '');
const currentStatus = defineParam('filter', (v) => v || '');
const currentPaginatedQuery = definePaginatedQuery('starts');

const calloutsTable = ref<Paginated<GetCalloutDataWith<'responseCount'>>>();

watchEffect(async () => {
  const rules: GetCalloutsQuery['rules'] = {
    condition: 'AND',
    rules: [
      ...(currentStatus.value
        ? [
            {
              field: 'status',
              operator: 'equal' as const,
              value: [currentStatus.value],
            },
          ]
        : []),
      ...(currentSearch.value
        ? [
            {
              field: 'title',
              operator: 'contains' as const,
              value: [currentSearch.value],
            },
          ]
        : []),
    ],
  };
  calloutsTable.value = await fetchCallouts(
    {
      ...currentPaginatedQuery.query,
      rules: rules.rules.length > 0 ? rules : undefined,
    },
    ['responseCount']
  );
});
</script>
