<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle :title="t('menu.notices')"></PageTitle>
    <div class="flex-0 ml-3">
      <AppButton href="/tools/notices">{{ t('notices.addNotice') }}</AppButton>
    </div>
  </div>
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
      <a
        :href="'/tools/notices/' + item.id"
        class="text-base text-link font-bold"
      >
        {{ value }}
      </a>
    </template>
    <template #createdAt="{ value }">
      <span class="whitespace-nowrap">{{ formatLocale(value, 'PP') }}</span>
    </template>
  </AppTable>
  <div class="mt-4 ml-auto">
    <AppPagination v-model="currentPage" :total-pages="totalPages" />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '../../components/forms/AppButton.vue';
import PageTitle from '../../components/PageTitle.vue';
import { Paginated, GetNoticeData } from '../../utils/api/api.interface';
import AppTable from '../../components/table/AppTable.vue';
import AppPagination from '../../components/AppPagination.vue';
import { Header, SortType } from '../../components/table/table.interface';
import { fetchNotices } from '../../utils/api/notice';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import AppItemStatus from '../../components/AppItemStatus.vue';

const { t } = useI18n();

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

const totalPages = computed(() =>
  Math.ceil(noticesTable.value.total / currentPageSize.value)
);

watchEffect(async () => {
  noticesTable.value = await fetchNotices({
    limit: currentPageSize.value,
    offset: currentPage.value * currentPageSize.value,
    sort: currentSort.value.by,
    order: currentSort.value.type,
  });
});
</script>
