<template>
  <div
    v-if="result"
    class="items-center justify-between text-sm md:flex md:gap-4"
  >
    <p class="mb-3 md:mb-0 md:flex-1">
      <i18n-t v-if="result.count > 0" :keypath="keypath">
        <template #start
          ><b>{{ n(result.offset + 1) }}</b></template
        >
        <template #end
          ><b>{{ n(result.offset + result.count) }}</b></template
        >
        <template #total
          ><b>{{ n(result.total) }}</b></template
        >
      </i18n-t>
    </p>

    <div class="flex gap-2">
      <p class="flex-1 self-center">
        <i18n-t v-if="result.count > 0" keypath="common.pageCount">
          <template #pageNumber
            ><b>{{ n(props.page + 1) }}</b></template
          >
          <template #pageTotal
            ><b>{{ n(totalPages) }}</b></template
          >
        </i18n-t>
      </p>
      <AppSelect
        v-model="currentPageSize"
        :items="pageSizes"
        input-class="text-sm"
      />
      <AppPagination
        v-if="totalPages > 1"
        v-model="currentPage"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSelect from './forms/AppSelect.vue';
import AppPagination from './AppPagination.vue';

const emit = defineEmits(['update:page', 'update:pageSize']);

const props = defineProps<{
  page: number;
  pageSize: number;
  result: Paginated<unknown> | undefined;
  keypath: string;
}>();

const { t, n } = useI18n();

const currentPage = computed({
  get: () => props.page,
  set: (newPage) => emit('update:page', newPage),
});

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (newPageSize) => emit('update:pageSize', newPageSize),
});

const pageSizes = computed(() =>
  [12, 25, 50, 100].map((x) => ({
    id: x,
    label: t('common.itemsPerPage', { items: n(x) }),
  }))
);

const totalPages = computed(() =>
  props.result ? Math.ceil(props.result.total / currentPageSize.value) : 0
);
</script>
