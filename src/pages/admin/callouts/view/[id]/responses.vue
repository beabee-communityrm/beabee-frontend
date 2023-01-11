<route lang="yaml">
name: adminCalloutViewResponses
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div>
    <AppTable
      :headers="headers"
      :items="responses?.items || null"
      class="w-full"
    >
      <template #responseNo="{ num, item }">
        <router-link
          :to="`/admin/callouts/view/${callout.slug}/responses/${item.id}`"
          class="text-base font-bold text-link"
        >
          Response {{ n(currentOffset + num + 1) }}
        </router-link>
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
import { Header } from '../../../../../components/table/table.interface';
import {
  GetCalloutData,
  GetCalloutResponseData,
} from '../../../../../utils/api/api.interface';
import { fetchResponses } from '../../../../../utils/api/callout';
import { formatLocale } from '../../../../../utils/dates/locale-date-formats';

const props = defineProps<{
  callout: GetCalloutData;
}>();

const { t, n } = useI18n();
const route = useRoute();
const router = useRouter();

const headers: Header[] = [
  {
    value: 'responseNo',
    text: t('calloutResponsesPage.responseNo'),
  },
  {
    value: 'createdAt',
    text: t('calloutResponse.data.createdAt'),
  },
  {
    value: 'tags',
    text: 'Tags',
  },
];

const responses = ref<Paginated<GetCalloutResponseData>>();

const currentPageSize = computed({
  get: () => Number(route.query.limit) || 25,
  set: (limit) => router.push({ query: { ...route.query, limit } }),
});

const currentPage = computed({
  get: () => Number(route.query.page) || 0,
  set: (page) => router.push({ query: { ...route.query, page } }),
});

const currentOffset = computed(() => currentPage.value * currentPageSize.value);

watchEffect(async () => {
  responses.value = await fetchResponses(props.callout.slug, {
    limit: currentPageSize.value,
    offset: currentOffset.value,
  });
});
</script>
