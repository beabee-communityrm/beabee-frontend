<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle :title="t('menu.community')"></PageTitle>
    <div class="flex-1 md:hidden">
      <select
        class="
          p-2
          w-full
          border border-primary-40
          rounded
          focus:outline-none focus:shadow-input
          bg-white
        "
        @change="currentSegment = handleInput($event)"
      >
        <option value="" :selected="!currentSegment">
          {{ t('contacts.allContacts') }}
          ({{ contactsTotal ? n(contactsTotal) : '???' }})
        </option>
        <option
          v-for="segment in segments"
          :key="segment.id"
          :value="segment.id"
          :selected="currentSegment === segment.id"
        >
          {{ segment.name }} ({{ segment.memberCount }})
        </option>
      </select>
    </div>
    <div class="flex-0 ml-3">
      <AppButton to="/contacts/add">{{ t('contacts.addContact') }}</AppButton>
    </div>
  </div>
  <div class="md:flex">
    <div class="flex-none hidden md:block" :style="{ flexBasis: '220px' }">
      <ul class="flex flex-col mr-5">
        <li>
          <SegmentItem
            v-model="currentSegment"
            :segment="{
              id: '',
              name: t('contacts.allContacts'),
              memberCount: contactsTotal,
            }"
          />
        </li>
        <li v-for="segment in segments" :key="segment.id">
          <SegmentItem v-model="currentSegment" :segment="segment" />
        </li>
      </ul>
    </div>
    <div class="flex-auto">
      <div class="flex">
        <div class="flex-1"><!-- actions --></div>
        <form
          class="relative"
          @submit.prevent="currentSearch = basicSearchValue"
        >
          <AppInput
            v-model="basicSearchValue"
            class="pr-8"
            :placeholder="t('contacts.search')"
          />
          <button class="absolute right-0 w-8 h-full">
            <font-awesome-icon icon="search" />
          </button>
        </form>
        <a
          href="/members?type=advanced"
          class="ml-2 p-2"
          :class="showAdvancedSearch && 'bg-primary-10'"
        >
          {{ t('contacts.advancedSearch') }}
        </a>
      </div>
      <div v-if="showAdvancedSearch" class="bg-primary-10 p-3 mt-1">
        Advanced search
      </div>
      <AppTable
        v-model:sort="currentSort"
        :headers="headers"
        :items="contactsTable.items"
        class="w-full mt-2 whitespace-nowrap"
      >
        <template #firstname="{ item }">
          <router-link
            :to="'/contacts/' + item.id"
            class="text-base text-link font-bold"
          >
            {{ item.firstname }} {{ item.lastname }}
          </router-link>
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
            {{ n(item.contributionAmount, 'currency') }}<br />
            {{
              item.contributionPeriod === ContributionPeriod.Monthly
                ? t('common.monthly')
                : t('common.annually')
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
import { computed, onBeforeMount, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import PageTitle from '../../components/PageTitle.vue';
import {
  GetMemberDataWithProfile,
  GetMembersQueryRuleGroup,
  GetSegmentData,
  Paginated,
} from '../../utils/api/api.interface';
import { fetchMembers } from '../../utils/api/member';
import AppTable from '../../components/table/AppTable.vue';
import { Header, SortType } from '../../components/table/table.interface';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import AppInput from '../../components/forms/AppInput.vue';
import AppPagination from '../../components/AppPagination.vue';
import { fetchSegmentMembers, fetchSegments } from '../../utils/api/segments';
import SegmentItem from './components/SegmentItem.vue';
import AppButton from '../../components/forms/AppButton.vue';
import handleInput from '../../utils/handle-input';

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
    by: (route.query.sortBy as string) || null,
    type: (route.query.sortType as SortType) || SortType.None,
  }),
  set: ({ by, type }) => {
    router.replace({
      query: {
        ...route.query,
        sortBy: by || undefined,
        sortType: type === SortType.None ? undefined : type,
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
const basicSearchValue = ref(currentSearch.value);
// basicSearchValue should always track currentSearch changes, but
// can be different when the user hasn't submitted the search
watch(currentSearch, (value) => {
  basicSearchValue.value = value;
});
const showAdvancedSearch = ref(false);

const totalPages = computed(() =>
  Math.ceil(contactsTable.value.total / currentPageSize.value)
);

onBeforeMount(async () => {
  // Load the total if in a segment, otherwise it will be updated automatically below
  if (currentSegment.value) {
    contactsTotal.value = (await fetchMembers({ limit: 1 })).total;
  }
  segments.value = await fetchSegments();
});

watchEffect(async () => {
  const rules: GetMembersQueryRuleGroup | undefined = currentSearch.value
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
    ...(currentSort.value.by &&
      currentSort.value.type !== SortType.None && {
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
