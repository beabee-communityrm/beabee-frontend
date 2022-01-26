<template>
  <div class="mb-5"><PageTitle :title="t('menu.community')"></PageTitle></div>
  <div class="flex">
    <div class="flex-none" :style="{ flexBasis: '200px' }">All contacts</div>
    <div class="flex-auto">
      <div class="flex justify-between">
        <div></div>
        <form class="relative" @submit.prevent>
          <AppInput :placeholder="t('contacts.search')" />
          <button class="absolute right-0">Q</button>
        </form>
      </div>
      <AppTable
        v-model:sortBy="currentSort"
        v-model:sortType="currentSortType"
        :headers="headers"
        :items="contactsTable?.items || []"
        class="w-full"
      >
        <template #name="{ item }">
          <router-link
            :to="'/contacts/' + item.id"
            class="text-base text-link font-bold"
          >
            {{ item.firstname }} {{ item.lastname }}
          </router-link>
          <p v-if="item.profile.description">
            {{ item.profile.description }}
          </p>
        </template>
        <template #tags="{ item }">
          <template v-if="item.profile.tags">
            <div v-for="tag in item.profile.tags" :key="tag">{{ tag }}</div>
          </template>
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
      <AppPagination
        v-model="currentPage"
        :total-pages="Math.floor((contactsTable?.total || 0) / pageSize)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import { GetMembersWithProfileData } from '../../utils/api/api.interface';
import { fetchMembers } from '../../utils/api/member';
import AppTable from '../../components/table/AppTable.vue';
import { Header, SortType } from '../../components/table/table.interface';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import AppInput from '../../components/forms/AppInput.vue';
import AppPagination from '../../components/AppPagination.vue';

const { t, n } = useI18n();

const headers: Header[] = [
  { value: 'name', text: t('contacts.data.name'), sortable: true },
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

const pageSize = 50;
const currentPage = ref(0);
const currentSort = ref<string | null>(null);
const currentSortType = ref(SortType.None);

const contactsTable = ref<GetMembersWithProfileData>();

watchEffect(async () => {
  contactsTable.value = await fetchMembers({
    offset: currentPage.value * pageSize,
    ...(currentSort.value &&
      currentSortType.value !== SortType.None && {
        sort: currentSort.value,
        order: currentSortType.value,
      }),
  });
});

async function sort(by: string | null, type: SortType) {
  currentSort.value = by;
  currentSortType.value = type;
}

onBeforeMount(async () => {
  contacts.value = (await fetchMembers()).items;
});

function computed(
  arg0: () => import('../../utils/api/api.interface').GetMembersWithProfileData
) {
  throw new Error('Function not implemented.');
}
</script>
