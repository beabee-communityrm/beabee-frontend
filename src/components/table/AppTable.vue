<template>
  <table class="font-semibold">
    <thead class="text-sm border-b border-primary-20">
      <tr>
        <th
          v-for="(item, index) in headers"
          :key="index"
          class="pb-2 relative"
          align="left"
          :style="{ width: item.width }"
          @click="sort(item)"
        >
          <slot :name="`header-${item.value}`">{{ item.text }}</slot>

          <span
            v-if="item.value === sortBy"
            class="absolute ml-2 top-0.5 text-xs"
          >
            <span v-if="currentSortType === SortType.Asc">&#9660;</span>
            <span v-else-if="currentSortType === SortType.Desc">&#9650;</span>
          </span>
        </th>
      </tr>
    </thead>

    <tbody class="text-xs">
      <tr
        v-for="(item, i) in localItems"
        :key="i"
        class="border-b border-primary-20"
      >
        <td v-for="(value, key, j) in item" :key="j" class="py-2 align-top">
          <slot :name="key" :item="item">{{ value }}</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
// TODO: improve typing

// custom header cell usage:
// `status` should be replaced with header item `value` property
//    <template #header-status>
//      <AppBadge>test</AppBadge>
//    </template>

// custom tabel cell usage:
// `email` should be replaced with the object property name of item
//  <template #email="{ item }">
//    <span class="text-secondary">{{ item.email }}</span>
//  </template>

import { ref } from 'vue';
import { Header, SortType } from './table.interface';
import orderby from 'lodash.orderby';

const props = defineProps({
  headers: {
    type: Array as () => Header[],
    default: () => [],
  },
  items: {
    type: Array as () => Record<string, unknown>[],
    default: () => [],
  },
});

let localItems = ref([...props.items]);

// 'asc', 'desc', 'none'
let currentSortType = ref<SortType>(SortType.None);
let nextSortType = ref<SortType>(SortType.None);
let sortBy = ref('');

const resetSorting = () => {
  currentSortType.value = SortType.None;
  nextSortType.value = SortType.Desc;
  localItems.value = [...props.items];
};

const sort = (item: Header) => {
  if (!item.sortable) return;
  // if it's null or if clicks on a new column, reset
  if (!sortBy.value || item.value !== sortBy.value) {
    resetSorting();
  }

  sortBy.value = item.value;

  if (nextSortType.value === SortType.Desc) {
    localItems.value = orderby(localItems.value, [item.value], [SortType.Desc]);
    currentSortType.value = SortType.Desc;
    nextSortType.value = SortType.Asc;
  } else if (nextSortType.value === SortType.Asc) {
    localItems.value = orderby(localItems.value, [item.value], [SortType.Asc]);
    currentSortType.value = SortType.Asc;
    nextSortType.value = SortType.None;
  } else if (nextSortType.value === SortType.None) {
    // reset to default
    resetSorting();
    return;
  }
};
</script>
