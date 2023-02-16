<template>
  <table class="">
    <thead v-if="!hideHeaders" class="border-b border-primary-20 text-sm">
      <tr class="align-bottom">
        <th v-if="selectable" class="w-0 p-2">
          <AppCheckbox v-model="allSelected" />
        </th>
        <th
          v-for="(header, i) in headers"
          :key="i"
          class="relative p-2 font-semibold text-body-80"
          :class="{
            'cursor-pointer': header.sortable,
            'font-bold text-primary': header.value === sort?.by,
            'whitespace-normal': header.wrap,
            'whitespace-nowrap': !header.wrap,
          }"
          :align="header.align || 'left'"
          :style="{ width: header.width }"
          @click="sortBy(header)"
        >
          <slot :name="`header-${header.value}`">{{ header.text }}</slot>

          <font-awesome-icon
            v-if="header.value === sort?.by"
            class="ml-2"
            :icon="sort.type === SortType.Asc ? 'caret-down' : 'caret-up'"
          />
        </th>
      </tr>
    </thead>

    <tbody class="text-xs lg:text-sm">
      <tr v-if="items === null">
        <td :colspan="headers.length" class="p-2">
          <slot name="loading">
            <p>{{ t('common.loading') }}</p>
          </slot>
        </td>
      </tr>
      <tr v-else-if="!items.length">
        <td :colspan="headers.length" class="p-2">
          <slot name="empty">
            <p>{{ t('common.noResults') }}</p>
          </slot>
        </td>
      </tr>

      <tr
        v-for="(item, i) in items"
        :key="i"
        class="border-b border-primary-20"
        :class="rowClass(item)"
      >
        <td v-if="selectable" class="p-2">
          <AppCheckbox v-model="item.selected" />
        </td>
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppCheckbox from '../forms/AppCheckbox.vue';
import { Header, SortType } from './table.interface';

interface Sort {
  by: string | null;
  type: SortType;
}

// TODO: it would be really nice to be able to make this a generic
// but unfortunately Vue doesn't support that at the moment
// https://github.com/vuejs/rfcs/discussions/436
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = any;

const props = defineProps<{
  sort?: Sort;
  headers: Header[];
  items: Item[] | null;
  selectable?: boolean;
  hideHeaders?: boolean;
  rowClass?: (item: Item) => string;
}>();

const emit = defineEmits(['update:sort']);

const { t } = useI18n();

const sort = computed({
  get: () => props.sort,
  set: (value) => emit('update:sort', value),
});

const allSelected = computed({
  get: () =>
    props.selectable && props.items
      ? props.items.every((i) => i.selected)
      : false,
  set: (newValue) => {
    if (!props.items) return;
    for (const item of props.items) {
      item.selected = newValue;
    }
  },
});

function rowClass(item: Item): string {
  return (
    (props.rowClass ? props.rowClass(item) : '') +
    (props.selectable && item.selected ? ' bg-primary-10' : '')
  );
}

function sortBy(header: Header): void {
  if (!header.sortable) return;

  sort.value = {
    by: header.value,
    type:
      sort.value?.by === header.value && sort.value.type === SortType.Asc
        ? SortType.Desc
        : SortType.Asc,
  };
}
</script>
