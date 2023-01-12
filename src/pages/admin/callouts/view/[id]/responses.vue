<route lang="yaml">
name: adminCalloutViewResponses
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div>
    <AppTable
      v-model:sort="currentSort"
      :headers="headers"
      :items="responses?.items || null"
      class="w-full"
    >
      <template #response="{ item }">
        <router-link
          :to="`/admin/callouts/view/${callout.slug}/responses/${item.id}`"
          class="text-base font-bold text-link"
        >
          {{ item.id }}
        </router-link>
      </template>
      <template #contact="{ item }">
        <router-link
          v-if="item.contact"
          :to="`/admin/contacts/${item.contact.id}`"
          class="text-link"
        >
          {{ item.contact.email }}
        </router-link>
        <span v-else>-</span>
      </template>
      <template #createdAt="{ value }">
        {{ formatLocale(value, 'Pp') }}
      </template>
    </AppTable>
    <AppPaginatedResult
      v-model:page="currentPage"
      v-model:page-size="currentPageSize"
      :result="responses"
      keypath="calloutResponsesPage.showingOf"
      class="mt-4"
    />
  </div>
</template>
<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AppPaginatedResult from '../../../../../components/AppPaginatedResult.vue';
import AppTable from '../../../../../components/table/AppTable.vue';
import {
  Header,
  SortType,
} from '../../../../../components/table/table.interface';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../../../../utils/api/api.interface';
import { fetchResponses } from '../../../../../utils/api/callout';
import { formatLocale } from '../../../../../utils/dates/locale-date-formats';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const headers: Header[] = [
  {
    value: 'response',
    text: t('calloutResponsesPage.response'),
  },
  {
    value: 'contact',
    text: 'Contact',
  },
  {
    value: 'tags',
    text: 'Tags',
  },
  {
    value: 'createdAt',
    text: t('calloutResponse.data.createdAt'),
    sortable: true,
    align: 'right',
  },
];

const responses = ref<Paginated<GetCalloutResponseDataWith<'contact'>>>();

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

watchEffect(async () => {
  responses.value = await fetchResponses(
    props.callout.slug,
    {
      limit: currentPageSize.value,
      offset: currentPage.value * currentPageSize.value,
      sort: currentSort.value.by,
      order: currentSort.value.type,
    },
    ['contact']
  );
});
</script>
