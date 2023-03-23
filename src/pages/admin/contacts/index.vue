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
      <AppSearch
        v-model="currentRules"
        :filter-groups="filterGroups"
        :filter-items="filterItems"
        :has-changed="hasUnsavedSegment"
        @reset="currentRules = undefined"
      >
        <AppSearchInput
          v-model="currentSearch"
          :placeholder="t('contacts.search')"
        />
      </AppSearch>
      <SaveSegment
        v-if="hasUnsavedSegment && currentRules"
        :segment="currentSegment"
        :rules="currentRules"
        @saved="handleSavedSegment"
      />
      <AppPaginatedTable
        v-model:query="currentPaginatedQuery"
        :headers="headers"
        :result="contactsTable"
        keypath="contacts.showingOf"
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
            {{ item.displayName }}
          </router-link>
          <p
            v-if="item.profile.description"
            class="mt-1 whitespace-normal text-xs"
          >
            {{ item.profile.description }}
          </p>
        </template>
        <template #tags="{ item }">
          <AppTag v-for="tag in item.profile.tags" :key="tag" :tag="tag" />
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
          <span class="whitespace-nowrap">{{
            formatLocale(value, 'PPP')
          }}</span>
        </template>
        <template #membershipStarts="{ item }">
          <span class="whitespace-nowrap">{{
            getMembershipStartDate(item)
          }}</span>
        </template>
      </AppPaginatedTable>
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
import { formatLocale } from '../../../utils/dates';
import { fetchSegments } from '../../../utils/api/segments';
import AppButton from '../../../components/button/AppButton.vue';
import AppSearch from '../../../components/search/AppSearch.vue';
import AppSelect from '../../../components/forms/AppSelect.vue';
import AppVTabs from '../../../components/tabs/AppVTabs.vue';
import AppTag from '../../../components/AppTag.vue';
import {
  headers,
  filterGroups,
  filterItems,
} from '../../../components/pages/admin/contacts/contacts.interface';
import AppSearchInput from '../../../components/forms/AppSearchInput.vue';
import SaveSegment from '../../../components/pages/admin/contacts/SaveSegment.vue';
import { addBreadcrumb } from '../../../store/breadcrumb';
import { definePaginatedQuery } from '../../../utils/pagination';
import AppPaginatedTable from '../../../components/table/AppPaginatedTable.vue';

const { t, n } = useI18n();

const route = useRoute();
const router = useRouter();

addBreadcrumb(
  computed(() => [
    { title: t('menu.contacts'), to: '/admin/contacts', icon: 'users' },
  ])
);

const currentPaginatedQuery = definePaginatedQuery('joined');

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
    // showAdvancedSearch.value = false; // TODO
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
    ...currentPaginatedQuery.query,
    rules,
  };

  contactsTable.value = await fetchContacts(query, ['profile', 'roles']);
});
</script>
