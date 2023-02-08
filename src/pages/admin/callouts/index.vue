<route lang="yaml">
name: adminCallouts
meta:
  pageTitle: menu.callouts
  role: admin
</route>
<template>
  <PageTitle :title="t('menu.callouts')" border>
    <div class="flex-0 ml-3">
      <AppButton to="/admin/callouts/new">{{
        t('calloutsAdmin.addCallout')
      }}</AppButton>
    </div>
  </PageTitle>

  <AppAlert v-if="wasJustDeleted" class="mb-8">
    <template #icon>
      <font-awesome-icon :icon="['fa', 'magic']" />
    </template>
    {{ t('calloutAdmin.deleted') }}
  </AppAlert>

  <AppFilterGrid v-model="currentStatus" :items="statusItems">
    <div class="flex">
      <AppSearchInput
        v-model="currentSearch"
        :placeholder="t('callouts.search')"
      />
    </div>
    <AppTable
      v-model:sort="currentSort"
      :headers="headers"
      :items="calloutsTable?.items || null"
      class="mt-2 w-full"
    >
      <template #header-hidden><font-awesome-icon icon="eye" /></template>
      <template #status="{ value }">
        <AppItemStatus :status="value" />
      </template>
      <template #title="{ item, value }">
        <router-link
          :to="'/admin/callouts/view/' + item.slug"
          class="text-base font-bold text-link"
        >
          {{ value }}
        </router-link>
      </template>
      <template #hidden="{ value }">
        <font-awesome-icon
          :class="value ? 'text-body-80' : 'text-body-60'"
          :icon="value ? 'eye-slash' : 'eye'"
        />
      </template>
      <template #starts="{ value }">
        <span class="whitespace-nowrap">{{
          value && formatLocale(value, 'PP')
        }}</span>
      </template>
      <template #expires="{ value }">
        <span class="whitespace-nowrap">{{
          value && formatLocale(value, 'PP')
        }}</span>
      </template>
    </AppTable>
    <AppPaginatedResult
      v-model:page="currentPage"
      v-model:page-size="currentPageSize"
      :result="calloutsTable"
      keypath="callouts.showingOf"
      class="mt-4"
    />
  </AppFilterGrid>
</template>

<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Header, SortType } from '../../../components/table/table.interface';
import AppButton from '../../../components/forms/AppButton.vue';
import PageTitle from '../../../components/PageTitle.vue';
import AppTable from '../../../components/table/AppTable.vue';
import AppAlert from '../../../components/AppAlert.vue';
import AppItemStatus from '../../../components/AppItemStatus.vue';
import {
  GetCalloutDataWith,
  GetCalloutsQuery,
} from '../../../utils/api/api.interface';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import { fetchCallouts } from '../../../utils/api/callout';

import AppSelect from '../../../components/forms/AppSelect.vue';
import AppSearchInput from '../../../components/forms/AppSearchInput.vue';
import AppVTabs from '../../../components/tabs/AppVTabs.vue';
import AppPaginatedResult from '../../../components/AppPaginatedResult.vue';
import AppFilterGrid from '../../../components/AppFilterGrid.vue';
import { addBreadcrumb } from '../../../store/breadcrumb';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

addBreadcrumb(
  computed(() => [
    {
      title: t('menu.callouts'),
      icon: 'bullhorn',
      to: '/admin/callouts',
    },
  ])
);

const wasJustDeleted = route.query.deleted !== undefined;

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

const currentPageSize = computed({
  get: () => Number(route.query.limit) || 25,
  set: (limit) => router.push({ query: { ...route.query, limit } }),
});

const currentPage = computed({
  get: () => Number(route.query.page) || 0,
  set: (page) => router.push({ query: { ...route.query, page } }),
});

const currentSort = computed({
  get: () => ({
    by: (route.query.sortBy as string) || 'starts',
    type: (route.query.sortType as SortType) || SortType.Desc,
  }),
  set: ({ by, type }) => {
    router.replace({
      query: {
        ...route.query,
        sortBy: by,
        sortType: type,
      },
    });
  },
});

const currentSearch = computed({
  get: () => (route.query.s as string) || '',
  set: (s) => router.push({ query: { ...route.query, s } }),
});

const currentStatus = computed({
  get: () => (route.query.filter as string) || '',
  set: (filter) => router.push({ query: { ...route.query, filter } }),
});

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
      limit: currentPageSize.value,
      offset: currentPage.value * currentPageSize.value,
      sort: currentSort.value.by,
      order: currentSort.value.type,
      rules: rules.rules.length > 0 ? rules : undefined,
    },
    ['responseCount']
  );
});
</script>
