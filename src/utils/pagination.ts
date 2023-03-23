import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SortType } from '../components/table/table.interface';

export function definePaginatedQuery(sortBy: string) {
  const route = useRoute();
  const router = useRouter();

  const limit = computed({
    get: () => Number(route.query.limit) || 25,
    set: (limit) => router.push({ query: { ...route.query, limit } }),
  });

  const page = computed({
    get: () => Number(route.query.page) || 0,
    set: (page) => router.push({ query: { ...route.query, page } }),
  });

  const sort = computed({
    get: () => ({
      by: (route.query.sortBy as string) || sortBy,
      type: (route.query.sortType as SortType) || SortType.Desc,
    }),
    set: ({ by, type }) => {
      router.replace({
        query: {
          ...route.query,
          sortBy: by || undefined,
          sortType: type,
        },
      });
    },
  });

  return reactive({
    limit,
    page,
    sort,
    query: computed(() => ({
      limit: limit.value,
      offset: limit.value * page.value,
      ...(sort.value.by && {
        sort: sort.value.by,
        order: sort.value.type,
      }),
    })),
  });
}
