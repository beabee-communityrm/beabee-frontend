<route lang="yaml">
name: adminCalloutViewResponsesTable
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div class="md:flex">
    <div class="hidden flex-none basis-[220px] md:block">
      <AppVTabs v-model="currentBucket" :items="bucketItems" />
    </div>
    <div class="flex-1">
      <AppSearch
        v-model="currentRules"
        :filter-groups="filterGroupsWithQuestions"
        :filter-items="filterItemsWithExtras"
        :expanded="showAdvancedSearch"
        @reset="currentRules = undefined"
      >
        <AppSelect
          v-model="currentTag"
          :items="[
            { id: '', label: t('calloutResponsesPage.searchTag') },
            ...tagItems,
          ]"
        />
        <AppSelect
          v-model="currentAssignee"
          :items="[
            { id: '', label: t('calloutResponsesPage.searchAssignee') },
            ...adminItems,
          ]"
        />
      </AppSearch>
      <AppPaginatedTable
        v-model:query="currentPaginatedQuery"
        keypath="calloutResponsesPage.showingOf"
        :headers="headers"
        :result="responses"
      >
        <template #actions>
          <AppButtonGroup>
            <AppButton
              icon="download"
              variant="primaryOutlined"
              :title="t('actions.export')"
              @click="handleExport"
            />
            <MoveBucketButton
              :current-bucket="currentBucket"
              :disabled="selectedCount === 0"
              :loading="doingAction"
              @move="(bucket) => handleUpdateAction({ bucket })"
            />
            <ToggleTagButton
              :tag-items="tagItems"
              :selected-tags="selectedTags"
              :manage-url="`${responsesUrl}/tags`"
              :loading="doingAction"
              :disabled="selectedCount === 0"
              @toggle="(tagId) => handleUpdateAction({ tags: [tagId] })"
            />
            <SetAssigneeButton
              :disabled="selectedCount === 0"
              :current-assignee-id="selectedAssigneeId"
              @assign="(assigneeId) => handleUpdateAction({ assigneeId })"
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
        </template>

        <template #value-number="{ value, item }">
          <router-link
            :to="`${responsesUrl}/${item.id}`"
            class="text-base font-bold text-link"
          >
            {{ t('calloutResponsesPage.responseNo', { no: n(value) }) }}
          </router-link>
        </template>
        <template #value-assignee="{ value }">
          <router-link
            v-if="value"
            :to="`/admin/contacts/${value.id}`"
            class="text-link"
          >
            {{ value.displayName }}
          </router-link>
          <span v-else>-</span>
        </template>
        <template #value-contact="{ value }">
          <router-link
            v-if="value"
            :to="`/admin/contacts/${value.id}`"
            class="text-link"
          >
            {{ value.displayName }}
          </router-link>
          <span v-else>-</span>
        </template>
        <template #value-tags="{ value }">
          <span class="whitespace-normal">
            <AppTag v-for="tag in value" :key="tag.id" :tag="tag.name" />
          </span>
        </template>
        <template #value-createdAt="{ value }">
          {{
            t('common.timeAgo', {
              time: formatDistanceLocale(new Date(), value),
            })
          }}
        </template>
      </AppPaginatedTable>
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
import AppButton from '../../../../../../components/button/AppButton.vue';
import AppSelect from '../../../../../../components/forms/AppSelect.vue';
import AppVTabs from '../../../../../../components/tabs/AppVTabs.vue';
import {
  filterGroups,
  filterItems,
  headers,
} from '../../../../../../components/pages/admin/callout-responses.interface';
import AppSearch from '../../../../../../components/search/AppSearch.vue';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
  UpdateCalloutResponseData,
} from '../../../../../../utils/api/api.interface';
import { fetchResponses, fetchTags } from '../../../../../../utils/api/callout';
import { convertComponentsToFilters } from '../../../../../../utils/callouts';
import { formatDistanceLocale } from '../../../../../../utils/dates';
import AppButtonGroup from '../../../../../../components/button/AppButtonGroup.vue';
import { updateCalloutResponses } from '../../../../../../utils/api/callout-response';
import AppTag from '../../../../../../components/AppTag.vue';
import MoveBucketButton from '../../../../../../components/pages/admin/callouts/MoveBucketButton.vue';
import ToggleTagButton from '../../../../../../components/pages/admin/callouts/ToggleTagButton.vue';
import { buckets } from '../../../../../../components/pages/admin/callouts/callouts.interface';
import SetAssigneeButton from '../../../../../../components/pages/admin/callouts/SetAssigneeButton.vue';
import { fetchContacts } from '../../../../../../utils/api/contact';
import { definePaginatedQuery } from '../../../../../../utils/pagination';
import AppPaginatedTable from '../../../../../../components/table/AppPaginatedTable.vue';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();

const { t, n } = useI18n();
const route = useRoute();
const router = useRouter();

const responses =
  ref<Paginated<GetCalloutResponseDataWith<'assignee' | 'contact' | 'tags'>>>();
const showAdvancedSearch = ref(false);
const doingAction = ref(false);

const responseItems = ref<
  (GetCalloutResponseDataWith<'assignee' | 'contact' | 'tags'> & {
    selected: boolean;
  })[]
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

const selectedAssigneeId = computed(() => {
  let assigneeId = selectedResponseItems.value[0]?.assignee?.id;
  for (const item of selectedResponseItems.value) {
    if (assigneeId !== item.assignee?.id) {
      return '';
    }
  }
  return assigneeId;
});

const adminItems = ref<{ id: string; label: string }[]>([]);
const tagItems = ref<{ id: string; label: string }[]>([]);

const responsesUrl = computed(
  () =>
    router.resolve({
      name: 'adminCalloutViewResponsesTable',
      params: { id: props.callout.slug },
    }).href
);

const bucketItems = computed(() =>
  buckets.value.map((bucket) => ({
    ...bucket,
    to: responsesUrl.value + '?bucket=' + bucket.id,
  }))
);

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

const currentAssignee = computed({
  get: () => (route.query.assignee as string) || '',
  set: (assignee) =>
    router.push({ query: { ...route.query, assignee: assignee || undefined } }),
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

const currentPaginatedQuery = definePaginatedQuery('createdAt');

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

  const admins = await fetchContacts({
    rules: {
      condition: 'AND',
      rules: [
        { field: 'activePermission', operator: 'equal', value: ['admin'] },
      ],
    },
  });

  adminItems.value = admins.items.map((admin) => ({
    id: admin.id,
    label: admin.displayName,
  }));
});

function getSearchRules(): RuleGroup {
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

  if (currentAssignee.value) {
    rules.rules.push({
      field: 'assignee',
      operator: 'equal',
      value: [currentAssignee.value],
    });
  }

  return rules;
}

function getSelectedResponseRules(): RuleGroup {
  return {
    condition: 'OR',
    rules: selectedResponseItems.value.map((item) => ({
      field: 'id',
      operator: 'equal',
      value: [item.id],
    })),
  };
}

async function refreshResponses() {
  responses.value = await fetchResponses(
    props.callout.slug,
    {
      ...currentPaginatedQuery.query,
      rules: getSearchRules(),
    },
    ['assignee', 'contact', 'tags']
  );

  responseItems.value = responses.value.items.map((r) => ({
    ...r,
    selected: false,
  }));
}

watchEffect(refreshResponses);

function handleExport() {
  const rules: RuleGroup =
    selectedResponseItems.value.length > 0
      ? getSelectedResponseRules()
      : getSearchRules();

  const rulesQuery = encodeURIComponent(JSON.stringify(rules));

  window.open(
    `/api/1.0/callout/${props.callout.slug}/responses.csv?rules=${rulesQuery}`,
    '_blank'
  );
}

async function handleUpdateAction(
  updates: UpdateCalloutResponseData
): Promise<void> {
  doingAction.value = true;

  await updateCalloutResponses(getSelectedResponseRules(), updates);
  await refreshResponses();

  doingAction.value = false;
}
</script>
