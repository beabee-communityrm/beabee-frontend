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
          <MoveBucket
            :current-bucket="currentBucket"
            :disabled="selectedCount === 0"
            :loading="doingAction"
            @move="handleMoveBucket"
          />
          <ToggleTag
            :responses-url="responsesUrl"
            :tag-items="tagItems"
            :selected-tags="selectedTags"
            :loading="doingAction"
            :disabled="selectedCount === 0"
            @toggle="handleToggleTag"
          />
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
        <template #number="{ value, item }">
          <router-link
            :to="`${responsesUrl}/${item.id}`"
            class="text-base font-bold text-link"
          >
            {{ t('calloutResponsesPage.responseNo', { no: n(value) }) }}
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
  UpdateCalloutResponseData,
} from '../../../../../../utils/api/api.interface';
import { fetchResponses, fetchTags } from '../../../../../../utils/api/callout';
import { convertComponentsToFilters } from '../../../../../../utils/callouts';
import { formatDistanceLocale } from '../../../../../../utils/dates/locale-date-formats';
import AppButtonGroup from '../../../../../../components/button/AppButtonGroup.vue';
import { updateCalloutResponses } from '../../../../../../utils/api/callout-response';
import AppTag from '../../../../../../components/AppTag.vue';
import MoveBucket from '../../../../../../components/pages/admin/callouts/MoveBucket.vue';
import ToggleTag from '../../../../../../components/pages/admin/callouts/ToggleTag.vue';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();

const { t, n } = useI18n();
const route = useRoute();
const router = useRouter();

const responses =
  ref<Paginated<GetCalloutResponseDataWith<'contact' | 'tags'>>>();
const showAdvancedSearch = ref(false);
const doingAction = ref(false);

const responseItems =
  ref<
    (GetCalloutResponseDataWith<'contact' | 'tags'> & { selected: boolean })[]
  >();

const selectedResponseItems = computed(
  () => responseItems.value?.filter((ri) => ri.selected) || []
);

const selectedCount = computed(() => selectedResponseItems.value.length);

const selectedTags = computed(() => {
  const tagCount = Object.fromEntries(tagItems.value.map((t) => [t.id, 0]));

  for (const item of selectedResponseItems.value) {
    for (const tag of item.tags) {
      tagCount[tag.id]++;
    }
  }

  return Object.entries(tagCount)
    .filter((tc) => tc[1] === selectedCount.value)
    .map(([tagId]) => tagId);
});

const tagItems = ref<{ id: string; label: string }[]>([]);

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
  const tags = await fetchTags(props.callout.slug);
  tagItems.value = tags.map((tag) => ({ id: tag.id, label: tag.name }));
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

async function handleUpdateAction(
  updates: UpdateCalloutResponseData
): Promise<void> {
  doingAction.value = true;

  const ruleGroup: RuleGroup = {
    condition: 'OR',
    rules: selectedResponseItems.value.map((item) => ({
      field: 'id',
      operator: 'equal',
      value: [item.id],
    })),
  };

  await updateCalloutResponses(ruleGroup, updates);
  await refreshResponses();

  doingAction.value = false;
}

async function handleMoveBucket(bucket: string): Promise<void> {
  await handleUpdateAction({ bucket });
}

async function handleToggleTag(tagId: string): Promise<void> {
  const action = selectedTags.value.includes(tagId) ? '-' : '+';
  await handleUpdateAction({ tags: [`${action}${tagId}`] });
}
</script>
