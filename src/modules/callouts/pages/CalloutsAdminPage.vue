<template>
  <PageTitle :title="t('menu.callouts')" border>
    <div class="flex-1 block lg:hidden">
      <AppSelect v-model="currentStatus" :items="statusItems" />
    </div>
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

  <div class="md:flex">
    <div class="flex-none hidden lg:block basis-[220px]">
      <AppVTabs v-model="currentStatus" :items="statusItems" />
    </div>
    <div class="flex-auto">
      <div class="flex">
        <AppSearchInput
          v-model="currentSearch"
          :placeholder="t('callouts.search')"
        />
      </div>
      <AppTable
        v-model:sort="currentSort"
        :headers="headers"
        :items="calloutsTable.items"
        class="w-full mt-2"
      >
        <template #header-hidden><font-awesome-icon icon="eye" /></template>
        <template #status="{ value }">
          <AppItemStatus :status="value" />
        </template>
        <template #title="{ item, value }">
          <router-link
            :to="'/admin/callouts/view/' + item.slug"
            class="text-base text-link font-bold"
          >
            {{ value }}
          </router-link>
        </template>
        <template #hidden="{ value }">
          <font-awesome-icon
            :class="value ? 'text-body-80' : 'text-body-40'"
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
      <div class="mt-4 flex justify-end">
        <AppPagination v-model="currentPage" :total-pages="totalPages" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Header, SortType } from '../../../components/table/table.interface';
import AppButton from '../../../components/forms/AppButton.vue';
import PageTitle from '../../../components/PageTitle.vue';
import AppTable from '../../../components/table/AppTable.vue';
import AppPagination from '../../../components/AppPagination.vue';
import AppAlert from '../../../components/AppAlert.vue';
import AppItemStatus from '../../../components/AppItemStatus.vue';
import {
  Paginated,
  GetBasicCalloutData,
  GetCalloutsQuery,
} from '../../../utils/api/api.interface';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import { fetchCallouts } from '../../../utils/api/callout';

import AppSelect from '../../../components/forms/AppSelect.vue';
import AppSearchInput from '../../../components/forms/AppSearchInput.vue';
import AppVTabs from '../../../components/tabs/AppVTabs.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

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

const calloutsTable = ref<Paginated<GetBasicCalloutData>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});

const totalPages = computed(() =>
  Math.ceil(calloutsTable.value.total / currentPageSize.value)
);

watchEffect(async () => {
  const rules = {
    condition: 'AND',
    rules: [
      ...(currentStatus.value
        ? [
            {
              field: 'status',
              operator: 'equal',
              value: currentStatus.value,
            },
          ]
        : []),
      ...(currentSearch.value
        ? [
            {
              field: 'title' as const,
              operator: 'contains',
              value: currentSearch.value,
            },
          ]
        : []),
    ],
  } as NonNullable<GetCalloutsQuery['rules']>;
  calloutsTable.value = await fetchCallouts({
    limit: currentPageSize.value,
    offset: currentPage.value * currentPageSize.value,
    sort: currentSort.value.by,
    order: currentSort.value.type,
    rules: rules.rules.length > 0 ? rules : undefined,
  });
});
</script>
