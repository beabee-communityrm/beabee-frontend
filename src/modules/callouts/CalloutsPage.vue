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
  <table>
    <thead class="text-left whitespace-nowrap hidden md:table-header-group">
      <tr>
        <th class="py-2">{{ t('callouts.data.callout') }}</th>
        <th class="py-2 px-5">{{ t('callouts.data.endDate') }}</th>
        <th class="py-2"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="callout in archivedCallouts.items"
        :key="callout.slug"
        class="
          flex flex-wrap
          justify-between
          py-3
          md:table-row
          border-t border-primary-20
        "
      >
        <td class="pb-2 md:py-4 w-full">
          <router-link
            :to="`/callouts/${callout.slug}`"
            class="text-link font-semibold underline"
            >{{ callout.title }}</router-link
          >
        </td>
        <td class="md:py-4 md:px-5 whitespace-nowrap text-body-80 md:text-body">
          <time
            v-if="callout.expires"
            :datetime="callout.expires.toISOString()"
            :title="formatLocale(callout.expires, 'PPPppp')"
          >
            {{
              t('common.timeAgo', {
                time: formatDistanceLocale(new Date(), callout.expires),
              })
            }}
          </time>
          <span v-else>-</span>
        </td>
        <td
          v-if="callout.hasAnswered"
          class="md:py-4 text-success font-bold text-sm whitespace-nowrap"
        >
          <font-awesome-icon icon="check-circle" />
          {{ t('callouts.showAnswered') }}
        </td>
      </tr>
    </tbody>
  </table>
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

formatDistanceLocale;
formatLocale;

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

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
