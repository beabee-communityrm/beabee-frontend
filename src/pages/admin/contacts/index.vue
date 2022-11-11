<route lang="yaml">
name: adminContacts
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <PageTitle :title="t('menu.community')" border>
    <div class="flex-1 md:hidden">
      <AppSelect v-model="currentSegment" :items="segmentItems" />
    </div>
    <div class="flex-0 ml-3">
      <AppButton href="/members/add">{{ t('contacts.addContact') }}</AppButton>
    </div>
  </PageTitle>
  <div class="md:flex">
    <div class="hidden flex-none basis-[220px] md:block">
      <AppVTabs v-model="currentSegment" :items="segmentItems" />
    </div>
    <div class="flex-auto">
      <div class="flex">
        <AppSearchInput
          v-model="currentSearch"
          :placeholder="t('contacts.search')"
        />
        <button
          class="ml-2 flex items-center rounded border border-primary-40 px-3 text-sm font-semibold"
          :class="
            showAdvancedSearch &&
            'relative rounded-b-none border border-b-primary/0'
          "
          @click="showAdvancedSearch = !showAdvancedSearch"
        >
          {{ t('advancedSearch.button') }}
          <font-awesome-icon
            class="ml-2"
            :icon="['fa', showAdvancedSearch ? 'caret-up' : 'caret-down']"
          />
          <div
            class="absolute -left-[1px] top-full box-content h-2 w-full border-x border-x-primary-40 bg-primary-5 py-[1px]"
          />
        </button>
        <div
          v-if="contactsTable !== undefined"
          class="flex-1 self-center text-right"
        >
          <i18n-t keypath="contacts.numResults" :plural="contactsTable.total">
            <template #n>
              <b>{{ n(contactsTable.total) }}</b>
            </template>
          </i18n-t>
        </div>
      </div>
      <AppSearch
        v-model="currentRules"
        :filter-groups="filterGroups"
        :filter-items="filterItems"
        :expanded="showAdvancedSearch"
        @reset="currentRules = undefined"
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
              route.query.s ? t('contacts.noResults') : t('contacts.noContacts')
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
      <div v-if="contactsTable" class="mt-4 flex items-center text-sm">
        <p class="flex-1">
          <i18n-t v-if="contactsTable.count > 0" keypath="contacts.showingOf">
            <template #start
              ><b>{{ n(contactsTable.offset + 1) }}</b></template
            >
            <template #end
              ><b>{{
                n(contactsTable.offset + contactsTable.count)
              }}</b></template
            >
            <template #total
              ><b>{{ n(contactsTable.total) }}</b></template
            >
          </i18n-t>
        </p>
        <div class="mx-4">Page size</div>

        <AppPagination v-model="currentPage" :total-pages="totalPages" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ContributionPeriod, Paginated } from '@beabee/beabee-common';
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import PageTitle from '../../../components/PageTitle.vue';
import {
  GetMembersQuery,
  GetMemberDataWith,
  GetSegmentData,
} from '../../../utils/api/api.interface';
import { fetchMembers } from '../../../utils/api/member';
import AppTable from '../../../components/table/AppTable.vue';
import { Header, SortType } from '../../../components/table/table.interface';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import AppPagination from '../../../components/AppPagination.vue';
import { fetchSegments } from '../../../utils/api/segments';
import AppButton from '../../../components/forms/AppButton.vue';
import AppSearch from '../../../components/search/AppSearch.vue';
import AppSelect from '../../../components/forms/AppSelect.vue';
import AppVTabs from '../../../components/tabs/AppVTabs.vue';
import ContactTag from '../../../components/pages/admin/contacts/ContactTag.vue';
import {
  filterGroups,
  filterItems,
} from '../../../components/pages/admin/contacts/contacts.interface';
import AppSearchInput from '../../../components/forms/AppSearchInput.vue';

const { t, n } = useI18n();

const headers: Header[] = [
  {
    value: 'firstname',
    text: t('contacts.data.name'),
    sortable: true,
    width: '100%',
  },
  { value: 'email', text: t('contacts.data.email'), sortable: true },
  { value: 'tags', text: t('contacts.data.tags') },
  {
    value: 'contribution',
    text: t('contacts.data.contribution'),
    align: 'right',
  },
  {
    value: 'joined',
    text: t('contacts.data.joined'),
    align: 'right',
    sortable: true,
  },
  {
    value: 'membershipStarts',
    text: t('contacts.data.membershipStarts'),
    align: 'right',
    sortable: true,
    wrap: true,
  },
];

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

const currentRules = computed<GetMembersQuery['rules']>({
  get: () => {
    if (route.query.r) {
      return JSON.parse(route.query.r as string);
    } else if (currentSegment.value) {
      return segments.value.find((s) => s.id === currentSegment.value)
        ?.ruleGroup;
    } else {
      return undefined;
    }
  },
  set: (r) =>
    router.push({ query: { ...route.query, r: r && JSON.stringify(r) } }),
});

const currentSegment = computed({
  get: () => (route.query.segment as string) || '',
  set: (segment) => {
    router.push({ query: { segment: segment || undefined } });
    showAdvancedSearch.value = false;
  },
});

const segments = ref<GetSegmentData[]>([]);
const contactsTotal = ref<number | null>(null);
const contactsTable = ref<Paginated<GetMemberDataWith<'profile' | 'roles'>>>();
const totalPages = computed(() =>
  contactsTable.value
    ? Math.ceil(contactsTable.value.total / currentPageSize.value)
    : 0
);

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
    count: n(segment.memberCount),
    to: '/admin/contacts?segment=' + segment.id,
  })),
]);

function getMembershipStartDate(member: GetMemberDataWith<'roles'>): string {
  const membership = member.roles.find((role) => role.role === 'member');
  return membership ? formatLocale(membership.dateAdded, 'PPP') : '';
}

onBeforeMount(async () => {
  // Load the total if in a segment, otherwise it will be updated automatically below
  contactsTotal.value = (await fetchMembers({ limit: 1 })).total;
  segments.value = await fetchSegments();
});

watchEffect(async () => {
  const searchRules: GetMembersQuery['rules'] = {
    condition: 'OR',
    rules: currentSearch.value
      .split(' ')
      .filter((v) => !!v)
      .flatMap((value) => [
        {
          field: 'email',
          operator: 'contains' as const,
          value: [value],
        },
        {
          field: 'firstname',
          operator: 'contains' as const,
          value: [value],
        },
        {
          field: 'lastname',
          operator: 'contains' as const,
          value: [value],
        },
      ]),
  };

  const rules: GetMembersQuery['rules'] = currentRules.value
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

  contactsTable.value = await fetchMembers(query, ['profile', 'roles']);
});
</script>
