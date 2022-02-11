<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle :title="t('menu.community')"></PageTitle>
    <div class="flex-1 md:hidden">
      <AppSelect v-model="currentSegment" :items="segmentItems" />
    </div>
    <div class="flex-0 ml-3">
      <AppButton href="/members/add">{{ t('contacts.addContact') }}</AppButton>
    </div>
  </div>
  <div class="md:flex">
    <div class="flex-none hidden md:block" :style="{ flexBasis: '220px' }">
      <AppVTabs v-model="currentSegment" :items="segmentItems" />
    </div>
    <div class="flex-auto">
      <SearchBox v-model="currentSearch" />
      <AppTable
        v-model:sort="currentSort"
        :headers="headers"
        :items="contactsTable.items"
        class="w-full mt-2 whitespace-nowrap"
      >
        <template #firstname="{ item }">
          <a
            :href="'/members/' + item.id"
            class="text-base text-link font-bold"
          >
            {{ `${item.firstname} ${item.lastname}`.trim() || item.email }}
          </a>
          <p v-if="item.profile.description" class="whitespace-normal mt-1">
            {{ item.profile.description }}
          </p>
        </template>
        <template #tags="{ item }">
          <span class="whitespace-normal">
            <span
              v-for="tag in item.profile.tags"
              :key="tag"
              class="
                bg-white
                whitespace-nowrap
                text-link
                rounded
                font-bold
                inline-block
                p-1
                mr-1
                mb-1
                text-xs
              "
            >
              {{ tag }}
            </span>
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
      </AppTable>
      <div class="flex mt-4 items-center text-sm">
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
          <i18n-t v-else keypath="contacts.noResults" />
        </p>
        <div class="mx-4">Page size</div>

        <AppPagination v-model="currentPage" :total-pages="totalPages" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import PageTitle from '../../components/PageTitle.vue';
import {
  GetMemberDataWithProfile,
  GetMembersQuery,
  GetSegmentData,
  Paginated,
} from '../../utils/api/api.interface';
import { fetchMembers } from '../../utils/api/member';
import AppTable from '../../components/table/AppTable.vue';
import { Header, SortType } from '../../components/table/table.interface';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import AppPagination from '../../components/AppPagination.vue';
import { fetchSegmentMembers, fetchSegments } from '../../utils/api/segments';
import AppButton from '../../components/forms/AppButton.vue';
import SearchBox from './components/SearchBox.vue';
import AppSelect from '../../components/forms/AppSelect.vue';
import AppVTabs from '../../components/tabs/AppVTabs.vue';

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
];

const route = useRoute();
const router = useRouter();

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

const currentSegment = computed({
  get: () => (route.query.segment as string) || '',
  set: (segment) => router.push({ query: { segment: segment || undefined } }),
});

const segments = ref<GetSegmentData[]>([]);
const contactsTotal = ref<number | null>(null);
const contactsTable = ref<Paginated<GetMemberDataWithProfile>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});
const totalPages = computed(() =>
  Math.ceil(contactsTable.value.total / currentPageSize.value)
);

const segmentItems = computed(() => [
  {
    id: '',
    label: t('contacts.allContacts'),
    count: contactsTotal.value === null ? '???' : n(contactsTotal.value),
    to: '/contacts',
  },
  ...segments.value.map((segment) => ({
    id: segment.id,
    label: segment.name,
    count: n(segment.memberCount),
    to: '/contacts?segment=' + segment.id,
  })),
]);

onBeforeMount(async () => {
  // Load the total if in a segment, otherwise it will be updated automatically below
  if (currentSegment.value) {
    contactsTotal.value = (await fetchMembers({ limit: 1 })).total;
  }
  segments.value = await fetchSegments();
});

watchEffect(async () => {
  const rules: GetMembersQuery['rules'] | undefined = currentSearch.value
    ? {
        condition: 'OR',
        rules: [
          {
            field: 'email',
            operator: 'contains',
            value: currentSearch.value,
          },
          {
            field: 'firstname',
            operator: 'contains',
            value: currentSearch.value,
          },
          {
            field: 'lastname',
            operator: 'contains',
            value: currentSearch.value,
          },
        ],
      }
    : undefined;

  const query = {
    offset: currentPage.value * currentPageSize.value,
    limit: currentPageSize.value,
    rules,
    ...(currentSort.value.by && {
      sort: currentSort.value.by,
      order: currentSort.value.type,
    }),
  };

  contactsTable.value = currentSegment.value
    ? await fetchSegmentMembers(currentSegment.value, query)
    : await fetchMembers(query);

  // Update all contacts total if no segment
  if (!currentSegment.value) {
    contactsTotal.value = contactsTable.value.total;
  }
});
</script>
