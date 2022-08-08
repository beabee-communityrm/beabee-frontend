<route lang="yaml">
name: callouts
meta:
  pageTitle: menu.callouts
</route>

<template>
  <PageTitle :title="t('menu.callouts')" />
  <div class="flex -mx-3 mb-6 flex-wrap">
    <CalloutCard
      v-for="callout in activeCallouts.items"
      :key="callout.slug"
      :callout="callout"
      class="mb-5 mx-3"
    />
  </div>
  <AppHeading>{{ t('callouts.archive') }}</AppHeading>
  <div class="lg:flex justify-between items-center my-2">
    <AppSearchInput
      v-model="currentSearch"
      :placeholder="t('callouts.search')"
    />
    <div class="text-sm font-semibold text-primary-80 uppercase my-2 lg:my-0">
      <span>{{ t('callouts.show') }}</span>
      <AppToggle
        v-model="currentShow"
        :items="[
          { id: 'all', label: t('callouts.showAll') },
          { id: 'answered', label: t('callouts.showAnswered') },
        ]"
      />
    </div>
  </div>

  <AppTable
    :headers="headers"
    :items="archivedCallouts.items"
    class="w-full mt-2 whitespace-nowrap"
  >
    <template #empty>
      <p>{{ t('callout.noArchivedCallouts') }}</p>
    </template>

    <template #name="{ item }">
      <router-link
        :to="`/callouts/${item.slug}`"
        class="text-base text-link font-bold"
        >{{ item.title }}</router-link
      >
    </template>

    <template #expires="{ item }">
      <time
        v-if="item.expires"
        :datetime="item.expires.toISOString()"
        :title="formatLocale(item.expires, 'PPPppp')"
      >
        {{
          t('common.timeAgo', {
            time: formatDistanceLocale(new Date(), item.expires),
          })
        }}
      </time>
      <span v-else>-</span>
    </template>

    <template #answered="{ item }">
      <span v-if="item.hasAnswered">
        <font-awesome-icon icon="check-circle" />
        {{ t('callouts.showAnswered') }}
      </span>
    </template>
  </AppTable>

  <div class="ml-auto mt-3">
    <AppPagination v-model="currentPage" :total-pages="totalPages" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import AppHeading from '../../components/AppHeading.vue';
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import {
  GetBasicCalloutData,
  GetCalloutsQuery,
  ItemStatus,
  Paginated,
} from '../../utils/api/api.interface';
import CalloutCard from '../../components/CalloutCard.vue';
import AppSearchInput from '../../components/forms/AppSearchInput.vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchCallouts } from '../../utils/api/callout';
import AppPagination from '../../components/AppPagination.vue';
import {
  formatDistanceLocale,
  formatLocale,
} from '../../utils/dates/locale-date-formats';
import AppToggle from '../../components/forms/AppToggle.vue';
import { Header } from '../../components/table/table.interface';
import AppTable from '../../components/table/AppTable.vue';

formatDistanceLocale;
formatLocale;

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const headers: Header[] = [
  { value: 'name', text: t('callouts.data.callout') },
  { value: 'expires', text: t('callouts.data.endDate') },
  { value: 'answered', text: '' },
];

const currentPage = computed({
  get: () => Number(route.query.page) || 0,
  set: (page) => router.push({ query: { ...route.query, page } }),
});
const currentSearch = computed({
  get: () => (route.query.s as string) || '',
  set: (s) => router.push({ query: { ...route.query, s, page: undefined } }),
});
const currentShow = computed({
  get: () => (route.query.show === 'answered' ? 'answered' : 'all'),
  set: (show) =>
    router.push({
      query: { ...route.query, show, page: undefined },
    }),
});
const activeCallouts = ref<Paginated<GetBasicCalloutData>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});
const archivedCallouts = ref<Paginated<GetBasicCalloutData>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});

const totalPages = computed(() =>
  Math.ceil(archivedCallouts.value.total / pageSize)
);

onBeforeMount(async () => {
  activeCallouts.value = await fetchCallouts({
    sort: 'starts',
    order: 'DESC',
    rules: {
      condition: 'AND',
      rules: [
        {
          field: 'status',
          operator: 'equal',
          value: ItemStatus.Open,
        },
        {
          field: 'hidden',
          operator: 'equal',
          value: false,
        },
      ],
    },
  });
});

const pageSize = 15;

watchEffect(async () => {
  const query: GetCalloutsQuery = {
    offset: currentPage.value * pageSize,
    limit: pageSize,
    sort: 'expires',
    order: 'DESC',
    hasAnswered: 'me',
    rules: {
      condition: 'AND',
      rules: [
        {
          field: 'title',
          operator: 'contains',
          value: currentSearch.value,
        },
        {
          field: 'hidden',
          operator: 'equal',
          value: false,
        },
        {
          field: 'status',
          operator: 'equal',
          value: ItemStatus.Ended,
        },
        ...(currentShow.value === 'answered'
          ? [
              {
                field: 'answeredBy',
                operator: 'equal',
                value: 'me',
              } as const,
            ]
          : []),
      ],
    },
  };

  archivedCallouts.value = await fetchCallouts(query);
});
</script>
