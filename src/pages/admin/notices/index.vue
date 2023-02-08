<route lang="yaml">
name: adminNotices
meta:
  role: admin
  pageTitle: menu.notices
</route>

<template>
  <PageTitle :title="t('menu.notices')" border>
    <div class="flex-0 ml-3">
      <AppButton to="/admin/notices/add">{{
        t('notices.addNotice')
      }}</AppButton>
    </div>
  </PageTitle>
  <AppTable
    v-model:sort="currentSort"
    :headers="headers"
    :items="noticesTable.items"
    class="w-full"
  >
    <template #status="{ value }">
      <AppItemStatus :status="value" />
    </template>
    <template #name="{ item, value }">
      <router-link
        :to="'/admin/notices/view/' + item.id"
        class="text-base font-bold text-link"
      >
        {{ value }}
      </router-link>
    </template>
    <template #createdAt="{ value }">
      <span class="whitespace-nowrap">{{ formatLocale(value, 'PP') }}</span>
    </template>
  </AppTable>
  <AppPaginatedResult
    v-model:page="currentPage"
    v-model:page-size="currentPageSize"
    :result="noticesTable"
    keypath="notices.showingOf"
    class="mt-4"
  />
</template>
<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '../../../components/forms/AppButton.vue';
import PageTitle from '../../../components/PageTitle.vue';
import { GetNoticeData } from '../../../utils/api/api.interface';
import AppTable from '../../../components/table/AppTable.vue';
import { Header, SortType } from '../../../components/table/table.interface';
import { fetchNotices } from '../../../utils/api/notice';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import AppItemStatus from '../../../components/AppItemStatus.vue';
import AppPaginatedResult from '../../../components/AppPaginatedResult.vue';
import { addBreadcrumb } from '../../../store/breadcrumb';

const { t } = useI18n();

addBreadcrumb(
  computed(() => [{ title: t('menu.notices'), icon: 'sign-hanging' }])
);

const headers: Header[] = [
  {
    value: 'status',
    text: t('notices.data.status'),
  },
  {
    value: 'name',
    text: t('notices.data.name'),
    sortable: true,
    width: '100%',
  },
  {
    value: 'createdAt',
    text: t('notices.data.createdAt'),
    align: 'right',
    sortable: true,
  },
];

const route = useRoute();
const router = useRouter();

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
    by: (route.query.sortBy as string) || 'createdAt',
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

const noticesTable = ref<Paginated<GetNoticeData>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});

watchEffect(async () => {
  noticesTable.value = await fetchNotices({
    limit: currentPageSize.value,
    offset: currentPage.value * currentPageSize.value,
    sort: currentSort.value.by,
    order: currentSort.value.type,
  });
});
</script>
