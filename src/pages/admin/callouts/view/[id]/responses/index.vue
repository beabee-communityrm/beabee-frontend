<route lang="yaml">
name: adminCalloutViewResponses
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div>
    <div class="flex gap-2">
      <AppSelect :items="[]" />
      <AppButton
        variant="primaryOutlined"
        size="sm"
        class="bg-white/0"
        :class="showAdvancedSearch && 'relative rounded-b-none'"
        @click="showAdvancedSearch = !showAdvancedSearch"
      >
        {{ t('advancedSearch.button') }}
        <font-awesome-icon
          class="ml-2"
          :icon="['fa', showAdvancedSearch ? 'caret-up' : 'caret-down']"
        />
        <div
          v-show="showAdvancedSearch"
          class="absolute -left-px top-full box-content h-2 w-full border-x border-x-primary-40 bg-primary-5 py-px"
        />
      </AppButton>
    </div>
    <AppSearch
      v-model="currentRules"
      :filter-groups="filterGroupsWithQuestions"
      :filter-items="filterItemsWithQuestions"
      :expanded="showAdvancedSearch"
      :has-changed="false"
      @reset="currentRules = undefined"
    />
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
import { flattenComponents, Paginated, RuleGroup } from '@beabee/beabee-common';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AppPaginatedResult from '../../../../../../components/AppPaginatedResult.vue';
import AppButton from '../../../../../../components/forms/AppButton.vue';
import AppSelect from '../../../../../../components/forms/AppSelect.vue';
import {
  filterGroups,
  filterItems,
  headers,
} from '../../../../../../components/pages/admin/callout-responses.interface';
import AppSearch from '../../../../../../components/search/AppSearch.vue';
import AppTable from '../../../../../../components/table/AppTable.vue';
import { SortType } from '../../../../../../components/table/table.interface';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../../../../../utils/api/api.interface';
import { fetchResponses } from '../../../../../../utils/api/callout';
import { convertComponentsToFilters } from '../../../../../../utils/callouts';
import { formatLocale } from '../../../../../../utils/dates/locale-date-formats';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const responses = ref<Paginated<GetCalloutResponseDataWith<'contact'>>>();
const showAdvancedSearch = ref(false);

const formQuestions = computed(() =>
  flattenComponents(props.callout.formSchema.components).filter(
    (c) => !!c.input && c.type !== 'button'
  )
);

const filterGroupsWithQuestions = computed(() => [
  ...filterGroups.value,
  {
    label: 'Answers',
    items: formQuestions.value.map((q) => `answers.${q.key}`),
  },
]);

const filterItemsWithQuestions = computed(() => {
  return {
    ...filterItems.value,
    ...convertComponentsToFilters(formQuestions.value),
  };
});

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

const currentRules = computed({
  get: () =>
    route.query.r
      ? (JSON.parse(route.query.r as string) as RuleGroup)
      : undefined,
  set: (r) =>
    router.push({ query: { ...route.query, r: r && JSON.stringify(r) } }),
});

watchEffect(async () => {
  responses.value = await fetchResponses(
    props.callout.slug,
    {
      limit: currentPageSize.value,
      offset: currentPage.value * currentPageSize.value,
      sort: currentSort.value.by,
      order: currentSort.value.type,
      rules: currentRules.value,
    },
    ['contact']
  );
});
</script>
