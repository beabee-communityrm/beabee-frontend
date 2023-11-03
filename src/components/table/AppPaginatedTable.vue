<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="mb-2 flex gap-4">
      <slot name="actions"></slot>
      <AppPaginatedTableResult
        v-model:page="query.page"
        v-model:limit="query.limit"
        :keypath="keypath"
        :result="result"
        class="ml-auto"
        no-limit
      />
    </div>
    <AppTable
      v-model:sort="query.sort"
      :headers="headers"
      :items="result?.items || null"
      :selectable="selectable"
      :row-class="rowClass"
      class="mb-4 w-full"
    >
      <template
        v-for="(name, index) of Object.keys($slots)"
        #[name]="slotData"
        :key="index"
      >
        <slot :name="name" v-bind="slotData || {}"></slot>
      </template>
    </AppTable>
    <AppPaginatedTableResult
      v-model:page="query.page"
      v-model:limit="query.limit"
      :keypath="keypath"
      :result="result"
    />
  </div>
</template>

<script lang="ts" setup generic="I extends Item">
import { Paginated } from '@beabee/beabee-common';
import AppPaginatedTableResult from './AppPaginatedTableResult.vue';
import AppTable from './AppTable.vue';
import { Header, Item, SortType } from './table.interface';

defineProps<{
  headers: Header[];
  keypath: string;
  result: Paginated<I> | undefined;
  query: {
    page: number;
    limit: number;
    sort?: {
      by: string;
      type: SortType;
    };
  };
  selectable?: boolean;
  rowClass?: (item: I) => string;
}>();
</script>
