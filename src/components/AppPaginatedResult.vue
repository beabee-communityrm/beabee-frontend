<template>
  <div v-if="result" class="mt-4 flex items-center text-sm">
    <p class="flex-1">
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
    <!-- <div class="mx-4">Page size</div> -->

    <AppPagination v-model="currentPage" :total-pages="totalPages" />
  </div>
</template>
<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppPagination from './AppPagination.vue';

const emit = defineEmits(['update:page', 'update:pageSize']);

const props = defineProps<{
  page: number;
  pageSize: number;
  result: Paginated<unknown> | undefined;
  keypath: string;
}>();

const { n } = useI18n();

const currentPage = computed({
  get: () => props.page,
  set: (newPage) => emit('update:page', newPage),
});

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (newPageSize) => emit('update:pageSize', newPageSize),
});

const totalPages = computed(() =>
  props.result ? Math.ceil(props.result.total / currentPageSize.value) : 0
);
</script>
