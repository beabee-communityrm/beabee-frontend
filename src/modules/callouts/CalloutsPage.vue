<template>
  <PageTitle :title="t('menu.callouts')" />
  <div class="flex -mx-3 my-6 flex-wrap">
    <CalloutCard
      v-for="callout in activeCallouts.items"
      :key="callout.slug"
      :callout="callout"
      class="mb-5 mx-3"
    />
  </div>
  <AppHeading>{{ t('callouts.archive') }}</AppHeading>
  <div class="flex justify-between items-center my-2">
    <AppSearchInput
      v-model="currentSearch"
      :placeholder="t('callouts.search')"
    />
    <div>
      {{ t('callouts.show') }}:
      {{ t('callouts.answered') }}
    </div>
  </div>
  <table>
    <thead class="text-left whitespace-nowrap">
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
        class="border-t border-primary"
      >
        <td class="py-4 w-full">
          <router-link
            :to="`/callouts/${callout.slug}`"
            class="text-link font-semibold underline"
            >{{ callout.title }}</router-link
          >
        </td>
        <td class="py-4 px-5 whitespace-nowrap">
          {{
            callout.expires
              ? formatDistanceLocale(new Date(), callout.expires)
              : '-'
          }}
        </td>
        <td
          v-if="callout.hasAnswered"
          class="py-4 text-success font-bold text-sm whitespace-nowrap"
        >
          <font-awesome-icon icon="check-circle" />
          {{ t('callouts.answered') }}
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
  CalloutStatus,
  GetBasicCalloutData,
  GetCalloutsQuery,
  Paginated,
} from '../../utils/api/api.interface';
import CalloutCard from '../../components/CalloutCard.vue';
import AppSearchInput from '../../components/forms/AppSearchInput.vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchCallouts } from '../../utils/api/callout';
import AppPagination from '../../components/AppPagination.vue';
import { formatDistanceLocale } from '../../utils/dates/locale-date-formats';

formatDistanceLocale;

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const currentPage = computed({
  get: () => Number(route.query.page) || 0,
  set: (page) => router.push({ query: { ...route.query, page } }),
});
const currentSearch = computed({
  get: () => (route.query.s as string) || '',
  set: (s) => router.push({ query: { s } }),
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
    status: CalloutStatus.Open,
    sort: 'starts',
    order: 'DESC',
  });
});

const pageSize = 15;

watchEffect(async () => {
  const query: GetCalloutsQuery = {
    offset: currentPage.value * pageSize,
    limit: pageSize,
    rules: {
      condition: 'OR',
      rules: [
        {
          field: 'title',
          operator: 'contains',
          value: currentSearch.value,
        },
      ],
    },
    status: CalloutStatus.Finished,
    sort: 'starts',
    order: 'DESC',
    hasAnswered: 'me',
  };

  archivedCallouts.value = await fetchCallouts(query);
});
</script>
