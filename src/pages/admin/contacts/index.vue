<route lang="yaml">
name: adminContacts
meta:
  pageTitle: menu.contacts
  role: admin
</route>

<template>
  <PageTitle :title="t('menu.contacts')" border>
    <div class="flex-1 md:hidden">
      <AppSelect v-model="currentSegmentId" :items="segmentItems" />
    </div>
    <div class="flex-0 ml-3">
      <AppButton to="/admin/contacts/add">
        {{ t('contacts.addContact') }}
      </AppButton>
    </div>
  </PageTitle>
  <div class="md:flex">
    <div class="hidden flex-none basis-[220px] md:block">
      <AppVTabs v-model="currentSegmentId" :items="segmentItems" />
    </div>
    <div class="flex-auto">
      <div class="flex">
        <AppSearchInput
          v-model="currentSearch"
          :placeholder="t('contacts.search')"
        />
        <AppButton
          variant="primaryOutlined"
          size="sm"
          class="ml-2 bg-white/0"
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
        :filter-groups="filterGroups"
        :filter-items="filterItems"
        :expanded="showAdvancedSearch"
        :has-changed="hasUnsavedSegment"
        @reset="currentRules = undefined"
      />

      <SaveSegment
        v-if="hasUnsavedSegment && currentRules"
        :segment="currentSegment"
        :rules="currentRules"
        @saved="handleSavedSegment"
      />
      <AppPaginatedResult
        v-model:page="currentPage"
        v-model:page-size="currentPageSize"
        :result="contactsTable"
        keypath="contacts.showingOf"
        class="mt-4"
      />
      <AppTable
        v-model:sort="currentSort"
        :headers="headers"
        :items="contactsTable?.items || null"
        class="mt-2 w-full whitespace-nowrap"
      >
        <template #empty>
          <p>
            {{
              currentRules || currentSearch
                ? t('contacts.noResults')
                : t('contacts.noContacts')
            }}
          </p>
        </template>
        <template #firstname="{ item }">
          <router-link
            :to="'/admin/contacts/' + item.id"
            class="text-base font-bold text-link"
          >
            {{ `${item.firstname} ${item.lastname}`.trim() || item.email }}
          </router-link>
          <p
            v-if="item.profile.description"
            class="mt-1 whitespace-normal text-xs"
          >
            {{ item.profile.description }}
          </p>
        </template>
        <template #tags="{ item }">
          <span class="whitespace-normal">
            <ContactTag
              v-for="tag in item.profile.tags"
              :key="tag"
              :tag="tag"
            />
          </span>
        </template>
        <template #contribution="{ item }">
          <span v-if="item.contributionAmount">
            {{ n(item.contributionAmount, 'currency') }}/{{
              item.contributionPeriod === ContributionPeriod.Monthly
                ? t('common.month')
                : t('common.year')
            }}
          </span>
        </template>
        <template #joined="{ value }">
          {{ formatLocale(value, 'PPP') }}
        </template>
        <template #membershipStarts="{ item }">
          {{ getMembershipStartDate(item) }}
        </template>
      </AppTable>
      <AppPaginatedResult
        v-model:page="currentPage"
        v-model:page-size="currentPageSize"
        :result="contactsTable"
        keypath="contacts.showingOf"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ContributionPeriod,
  Paginated,
  RuleGroup,
} from '@beabee/beabee-common';
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import PageTitle from '../../../components/PageTitle.vue';
import {
  GetContactsQuery,
  GetContactDataWith,
  GetSegmentDataWith,
} from '../../../utils/api/api.interface';
import { fetchContacts } from '../../../utils/api/contact';
import AppTable from '../../../components/table/AppTable.vue';
import { SortType } from '../../../components/table/table.interface';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import { fetchSegments } from '../../../utils/api/segments';
import AppButton from '../../../components/forms/AppButton.vue';
import AppSearch from '../../../components/search/AppSearch.vue';
import AppSelect from '../../../components/forms/AppSelect.vue';
import AppVTabs from '../../../components/tabs/AppVTabs.vue';
import ContactTag from '../../../components/contact/ContactTag.vue';
import {
  headers,
  filterGroups,
  filterItems,
} from '../../../components/pages/admin/contacts/contacts.interface';
import AppSearchInput from '../../../components/forms/AppSearchInput.vue';
import AppPaginatedResult from '../../../components/AppPaginatedResult.vue';
import SaveSegment from '../../../components/pages/admin/contacts/SaveSegment.vue';

const { t, n } = useI18n();

const route = useRoute();
const router = useRouter();

const showAdvancedSearch = ref(false);

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
    by: (route.query.sortBy as string) || 'joined',
    type: (route.query.sortType as SortType) || SortType.Desc,
  }),
  set: ({ by, type }) => {
    router.replace({
      query: {
        ...route.query,
        sortBy: by || undefined,
        sortType: type,
      },
    });
  },
});

const currentSearch = computed({
  get: () => (route.query.s as string) || '',
  set: (s) => router.push({ query: { ...route.query, s } }),
});

const currentRules = computed({
  get: () =>
    route.query.r
      ? (JSON.parse(route.query.r as string) as RuleGroup)
      : currentSegment.value?.ruleGroup,
  set: (r) =>
    router.push({ query: { ...route.query, r: r && JSON.stringify(r) } }),
});

const currentSegment = computed(() =>
  currentSegmentId.value
    ? segments.value.find((s) => s.id === currentSegmentId.value)
    : undefined
);

const currentSegmentId = computed({
  get: () => (route.query.segment as string) || '',
  set: (segment) => {
    router.push({ query: { segment: segment || undefined } });
    showAdvancedSearch.value = false;
  },
});

const hasUnsavedSegment = computed(
  () =>
    !!route.query.r &&
    !!currentRules.value &&
    currentRules.value.rules.length > 0
);

const segments = ref<GetSegmentDataWith<'contactCount'>[]>([]);
const contactsTotal = ref<number | null>(null);
const contactsTable = ref<Paginated<GetContactDataWith<'profile' | 'roles'>>>();

const segmentItems = computed(() => [
  {
    id: '',
    label: t('contacts.allContacts'),
    count: contactsTotal.value === null ? '???' : n(contactsTotal.value),
    to: '/admin/contacts',
  },
  ...segments.value.map((segment) => ({
    id: segment.id,
    label: segment.name,
    count: n(segment.contactCount),
    to: '/admin/contacts?segment=' + segment.id,
  })),
]);

function getMembershipStartDate(contact: GetContactDataWith<'roles'>): string {
  const membership = contact.roles.find((role) => role.role === 'member');
  return membership ? formatLocale(membership.dateAdded, 'PPP') : '';
}

function handleSavedSegment(segment: GetSegmentDataWith<'contactCount'>) {
  const segmentIndex = segments.value.findIndex((s) => s.id === segment.id);
  if (segmentIndex > -1) {
    segments.value[segmentIndex] = segment;
  } else {
    segments.value.push(segment);
  }
  currentSegmentId.value = segment.id;
}

onBeforeMount(async () => {
  contactsTotal.value = (await fetchContacts({ limit: 1 })).total;
  segments.value = await fetchSegments(['contactCount']);
});

watchEffect(async () => {
  const searchRules: GetContactsQuery['rules'] = {
    condition: 'OR',
    rules: currentSearch.value
      .split(' ')
      .filter((v) => !!v)
      .flatMap((value) => [
        {
          field: 'email',
          operator: 'contains',
          value: [value],
        },
        {
          field: 'firstname',
          operator: 'contains',
          value: [value],
        },
        {
          field: 'lastname',
          operator: 'contains',
          value: [value],
        },
      ]),
  };

  const rules: GetContactsQuery['rules'] = currentRules.value
    ? {
        condition: 'AND',
        rules: [currentRules.value, searchRules],
      }
    : searchRules;

  const query = {
    offset: currentPage.value * currentPageSize.value,
    limit: currentPageSize.value,
    rules,
    ...(currentSort.value.by && {
      sort: currentSort.value.by,
      order: currentSort.value.type,
    }),
  };

  contactsTable.value = await fetchContacts(query, ['profile', 'roles']);
});
</script>
