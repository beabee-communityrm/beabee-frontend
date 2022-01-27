<template>
  <table class="font-semibold">
    <thead class="text-sm border-b border-primary-20">
      <tr>
        <th
          v-for="(header, i) in headers"
          :key="i"
          class="p-2 relative"
          :class="{ 'cursor-pointer': header.sortable }"
          align="left"
          :style="{ width: header.width }"
          @click="header.sortable ? sort(header) : undefined"
        >
          <slot :name="`header-${header.value}`">{{ header.text }}</slot>

          <span
            v-if="header.value === sortBy"
            class="absolute ml-2 top-2 text-xs"
          >
            <span v-if="sortType === SortType.Asc">&#9660;</span>
            <span v-else-if="sortType === SortType.Desc">&#9650;</span>
          </span>
        </th>
      </tr>
    </thead>

    <tbody class="text-xs">
      <tr
        v-for="(item, i) in items"
        :key="i"
        class="border-b border-primary-20"
      >
        <td
          v-for="(header, j) in headers"
          :key="j"
          class="p-2 align-top"
          :align="header.align || undefined"
        >
          <slot :name="header.value" :item="item" :value="item[header.value]">{{
            item[header.value]
          }}</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Header, SortType } from './table.interface';

defineProps<{
  headers: Header[];
  items: any[]; // TODO: improve typing
}>();

const emit = defineEmits(['update:sort']);

let sortType = ref<SortType>(SortType.None);
let sortBy = ref<null | string>(null);

function sort(header: Header) {
  // if it's null or if clicks on a new column, reset
  if (!sortBy.value || header.value !== sortBy.value) {
    sortType.value = SortType.None;
  }

  sortBy.value = header.value;

  if (sortType.value === SortType.None) {
    sortType.value = SortType.Asc;
  } else if (sortType.value === SortType.Asc) {
    sortType.value = SortType.Desc;
  } else if (sortType.value === SortType.Desc) {
    sortType.value = SortType.None;
    sortBy.value = null;
  }

  emit('update:sort', { by: sortBy.value, type: sortType.value });
}
</script>
