<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="mb-2 flex justify-between">
      <div><slot name="actions"></slot></div>
      <AppPaginatedTableResult
        v-model:page="query.page"
        v-model:page-size="query.limit"
        :keypath="keypath"
        :result="result"
        no-page-size
      />
    </div>
    <AppTable
      v-model:sort="query.sort"
      :headers="headers"
      :items="result?.items || null"
      class="mb-4 w-full"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </AppTable>
    <AppPaginatedTableResult
      v-model:page="query.page"
      v-model:page-size="query.limit"
      :keypath="keypath"
      :result="result"
    />
  </div>
</template>

<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import AppPaginatedTableResult from './AppPaginatedTableResult.vue';
import AppTable from './AppTable.vue';
import { Header, SortType } from './table.interface';

defineProps<{
  headers: Header[];
  keypath: string;
  result: Paginated<unknown> | undefined;
  query: {
    page: number;
    limit: number;
    sort?: {
      by: string;
      type: SortType;
    };
  };
}>();
</script>
