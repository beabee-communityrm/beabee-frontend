import { computed, reactive, WritableComputedRef } from 'vue';
import {
  LocationQueryValue,
  LocationQueryValueRaw,
  useRoute,
  useRouter,
} from 'vue-router';
import { SortType } from '../components/table/table.interface';

export function defineQueryParam<T extends LocationQueryValueRaw>(
  param: string,
  getter: (v: LocationQueryValue) => T,
  behaviour: 'replace' | 'push' = 'push'
): WritableComputedRef<T> {
  const route = useRoute();
  const router = useRouter();
  return computed({
    get: () => getter(route.query[param] as LocationQueryValue),
    set: (value) =>
      router[behaviour]({
        query: { ...route.query, [param]: value || undefined },
      }),
  });
}

export function definePaginatedQuery(sortBy: string) {
  const route = useRoute();
  const router = useRouter();

  const limit = defineQueryParam('limit', (v) => Number(v) || 25);
  const page = defineQueryParam('page', (v) => Number(v) || 0);

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
