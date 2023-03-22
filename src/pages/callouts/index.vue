<route lang="yaml">
name: callouts
meta:
  pageTitle: menu.callouts
</route>

<template>
  <PageTitle :title="t('menu.callouts')" />
  <div v-if="activeCallouts" class="-mx-3 mb-6 flex flex-wrap">
    <CalloutCard
      v-for="callout in activeCallouts.items"
      :key="callout.slug"
      :callout="callout"
      class="mx-3 mb-5"
    />
  </div>

  <AppHeading>{{ t('callouts.archive') }}</AppHeading>
  <div class="my-2 items-center justify-between lg:flex">
    <AppSearchInput
      v-model="currentSearch"
      :placeholder="t('callouts.search')"
    />
    <div class="my-2 text-sm font-semibold uppercase text-primary-80 lg:my-0">
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
    :items="archivedCallouts?.items || null"
    class="mt-2 w-full whitespace-nowrap"
  >
    <template #empty>
      <p>{{ t('callouts.noArchivedCallouts') }}</p>
    </template>

    <template #name="{ item }">
      <router-link
        :to="`/callouts/${item.slug}`"
        class="text-base font-bold text-link"
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
import { ItemStatus, Paginated } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import AppHeading from '../../components/AppHeading.vue';
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import {
  GetCalloutData,
  GetCalloutDataWith,
  GetCalloutsQuery,
} from '../../utils/api/api.interface';
import CalloutCard from '../../components/callout/CalloutCard.vue';
import AppSearchInput from '../../components/forms/AppSearchInput.vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchCallouts } from '../../utils/api/callout';
import AppPagination from '../../components/AppPagination.vue';
import { formatDistanceLocale, formatLocale } from '../../utils/dates';
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

const activeCallouts = ref<Paginated<GetCalloutData>>();
const archivedCallouts = ref<Paginated<GetCalloutDataWith<'hasAnswered'>>>();

const totalPages = computed(() =>
  archivedCallouts.value
    ? Math.ceil(archivedCallouts.value.total / pageSize)
    : 0
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
          value: [ItemStatus.Open],
        },
        {
          field: 'hidden',
          operator: 'equal',
          value: [false],
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
    rules: {
      condition: 'AND',
      rules: [
        {
          field: 'title',
          operator: 'contains',
          value: [currentSearch.value],
        },
        {
          field: 'hidden',
          operator: 'equal',
          value: [false],
        },
        {
          field: 'status',
          operator: 'equal',
          value: [ItemStatus.Ended],
        },
        ...(currentShow.value === 'answered'
          ? [
              {
                field: 'answeredBy',
                operator: 'equal' as const,
                value: ['me'],
              },
            ]
          : []),
      ],
    },
  };

  archivedCallouts.value = await fetchCallouts(query, ['hasAnswered']);
});
</script>
