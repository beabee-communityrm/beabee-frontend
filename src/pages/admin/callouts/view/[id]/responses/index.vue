<route lang="yaml">
name: adminCalloutViewResponsesTable
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div class="md:flex">
    <div class="hidden flex-none basis-[220px] md:block">
      <AppVTabs v-model="currentBucket" :items="buckets" />
    </div>
    <div class="flex-1">
      <div class="flex gap-2">
        <AppSelect
          v-model="currentTag"
          :items="[
            { id: '', label: t('calloutResponsePage.searchTag') },
            ...tagItems,
          ]"
        />
        <AppButton
          variant="primaryOutlined"
          size="sm"
          class="bg-white/0"
          icon="filter"
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
        :filter-items="filterItemsWithExtras"
        :expanded="showAdvancedSearch"
        :has-changed="false"
        @reset="currentRules = undefined"
      />
      <div class="mt-4 flex gap-4">
        <AppButtonGroup>
          <AppDropdownButton
            icon="folder"
            variant="primaryOutlined"
            :loading="doingAction"
            :disabled="!hasSelected"
          >
            <ul>
              <li
                v-for="bucket in buckets"
                :key="bucket.id"
                class="p-2 hover:bg-primary-5"
                :class="{ hidden: bucket.id === currentBucket }"
                @click="() => handleMoveBucket(bucket.id)"
              >
                {{
                  t('calloutResponsesPage.moveToBucket', {
                    bucket: bucket.label,
                  })
                }}
              </li>
            </ul>
          </AppDropdownButton>
          <AppDropdownButton
            icon="tag"
            variant="primaryOutlined"
            :disabled="!hasSelected"
          >
            <ul>
              <li
                v-for="tag in tagItems"
                :key="tag.id"
                class="px-4 py-3 hover:bg-primary-5"
              >
                {{ tag.label }}
              </li>
            </ul>
          </AppDropdownButton>
        </AppButtonGroup>
        <p v-if="selectedCount > 0" class="self-center text-sm">
          <i18n-t
            keypath="calloutResponsePage.selectedCount"
            :plural="selectedCount"
          >
            <template #n>
              <b>{{ selectedCount }}</b>
            </template>
          </i18n-t>
        </p>
        <AppPaginatedResult
          v-model:page="currentPage"
          v-model:page-size="currentPageSize"
          :result="responses"
          keypath="calloutResponsesPage.showingOf"
          no-page-size
          class="ml-auto"
        />
      </div>
      <AppTable
        v-model:sort="currentSort"
        :headers="headers"
        :items="responseItems || null"
        selectable
        class="mt-2 w-full"
      >
        <template #response="{ item }">
          <router-link
            :to="`${responsesUrl}/${item.id}`"
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
            {{ item.contact.displayName }}
          </router-link>
          <span v-else>-</span>
        </template>
        <template #tags="{ value }">
          <span class="whitespace-normal">
            <AppTag v-for="tag in value" :key="tag.id" :tag="tag.name" />
          </span>
        </template>
        <template #createdAt="{ value }">
          {{
            t('common.timeAgo', {
              time: formatDistanceLocale(new Date(), value),
            })
          }}
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
  </div>
</template>
<script lang="ts" setup>
import {
  flattenComponents,
  Paginated,
  Rule,
  RuleGroup,
} from '@beabee/beabee-common';
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AppPaginatedResult from '../../../../../../components/AppPaginatedResult.vue';
import AppButton from '../../../../../../components/button/AppButton.vue';
import AppSelect from '../../../../../../components/forms/AppSelect.vue';
import AppVTabs from '../../../../../../components/tabs/AppVTabs.vue';
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
  GetCalloutTagData,
} from '../../../../../../utils/api/api.interface';
import { fetchResponses, fetchTags } from '../../../../../../utils/api/callout';
import { convertComponentsToFilters } from '../../../../../../utils/callouts';
import { formatDistanceLocale } from '../../../../../../utils/dates/locale-date-formats';
import AppButtonGroup from '../../../../../../components/button/AppButtonGroup.vue';
import AppDropdownButton from '../../../../../../components/button/AppDropdownButton.vue';
import { updateCalloutResponses } from '../../../../../../utils/api/callout-response';
import AppTag from '../../../../../../components/AppTag.vue';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const responses = ref<Paginated<GetCalloutResponseDataWith<'contact'>>>();
const showAdvancedSearch = ref(false);
const doingAction = ref(false);

const responseItems =
  ref<(GetCalloutResponseDataWith<'contact'> & { selected: boolean })[]>();

const selectedCount = computed(() => {
  let count = 0;
  if (responseItems.value) {
    for (const item of responseItems.value) {
      if (item.selected) count++;
    }
  }
  return count;
});
const hasSelected = computed(() => selectedCount.value > 0);

const tags = ref<GetCalloutTagData[]>([]);

const tagItems = computed(() =>
  tags.value.map((tag) => ({ id: tag.id, label: tag.name }))
);

const responsesUrl = computed(
  () =>
    router.resolve({
      name: 'adminCalloutViewResponsesTable',
      params: { id: props.callout.slug },
    }).href
);

const buckets = computed(() => [
  { id: '', label: t('calloutResponseBuckets.inbox'), to: responsesUrl.value },
  {
    id: 'verified',
    label: t('calloutResponseBuckets.verified'),
    to: responsesUrl.value + '?bucket=verified',
  },
  {
    id: 'trash',
    label: t('calloutResponseBuckets.trash'),
    to: responsesUrl.value + '?bucket=trash',
  },
]);

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

const filterItemsWithExtras = computed(() => {
  return {
    ...filterItems.value,
    tags: {
      ...filterItems.value.tags,
      options: tagItems.value,
    },
    ...convertComponentsToFilters(formQuestions.value),
  };
});

const currentBucket = computed({
  get: () => (route.query.bucket as string) || '',
  set: (bucket) => router.push({ query: { bucket: bucket || undefined } }),
});

const currentTag = computed({
  get: () => (route.query.tag as string) || '',
  set: (tag) =>
    router.push({ query: { ...route.query, tag: tag || undefined } }),
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

onBeforeMount(async () => {
  tags.value = await fetchTags(props.callout.slug);
});

async function refreshResponses() {
  const bucketRule: Rule = currentBucket.value
    ? { field: 'bucket', operator: 'equal', value: [currentBucket.value] }
    : { field: 'bucket', operator: 'is_empty', value: [] };

  const rules: RuleGroup = { condition: 'AND', rules: [bucketRule] };

  if (currentRules.value) {
    rules.rules.push(currentRules.value);
  }

  if (currentTag.value) {
    rules.rules.push({
      field: 'tags',
      operator: 'contains',
      value: [currentTag.value],
    });
  }

  responses.value = await fetchResponses(
    props.callout.slug,
    {
      limit: currentPageSize.value,
      offset: currentPage.value * currentPageSize.value,
      sort: currentSort.value.by,
      order: currentSort.value.type,
      rules,
    },
    ['contact', 'tags']
  );

  responseItems.value = responses.value.items.map((r) => ({
    ...r,
    selected: false,
  }));
}

watchEffect(refreshResponses);

async function handleMoveBucket(bucket: string): Promise<void> {
  if (!responseItems.value) return; // Can't move bucket without selected items

  doingAction.value = true;

  const ruleGroup: RuleGroup = {
    condition: 'OR',
    rules: responseItems.value
      .filter((item) => item.selected)
      .map((item) => ({
        field: 'id',
        operator: 'equal',
        value: [item.id],
      })),
  };

  await updateCalloutResponses(ruleGroup, { bucket });
  await refreshResponses();

  doingAction.value = false;
}
</script>
