<template>
  <table class="">
    <thead v-if="!hideHeaders" class="border-b border-primary-20 text-sm">
      <tr class="align-bottom">
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
        :class="rowClass && rowClass(item)"
      >
        <td
          v-for="(header, j) in headers"
          :key="j"
          class="p-2 align-top"
          :align="header.align || undefined"
        >
          <slot
            :name="header.value"
            :item="item"
            :value="item[header.value]"
            :num="i"
            >{{ item[header.value] }}</slot
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Header, SortType } from './table.interface';

interface Sort {
  by: string | null;
  type: SortType;
}

const props = defineProps<{
  sort?: Sort;
  headers: Header[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[] | null; // TODO: improve typing
  hideHeaders?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowClass?: (item: any) => string;
}>();

const emit = defineEmits(['update:sort']);

const { t } = useI18n();

const sort = computed({
  get: () => props.sort,
  set: (value) => emit('update:sort', value),
});

function sortBy(header: Header) {
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
