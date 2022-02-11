<template>
  <PageTitle :title="t('menu.callouts')" />
  <div class="flex my-6">
    <CalloutCard
      v-for="callout in activeCallouts.items"
      :key="callout.slug"
      :callout="callout"
    />
  </div>
  <AppHeading>{{ t('callouts.archive') }}</AppHeading>
  <div class="flex">
    <AppSearchInput
      v-model="currentSearch"
      :placeholder="t('callouts.search')"
    />
  </div>
  <div class="flex justify-between">
    <div />
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

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const currentPage = computed({
  get: () => Number(route.query.page) || 0,
  set: (page) => router.push({ query: { ...route.query, page } }),
});
const currentSearch = computed({
  get: () => (route.query.s as string) || '',
  set: (s) => router.push({ query: { ...route.query, s } }),
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
  activeCallouts.value = await fetchCallouts({ status: CalloutStatus.Open });
});

const pageSize = 10;

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
  };

  archivedCallouts.value = await fetchCallouts(query);
});
</script>
