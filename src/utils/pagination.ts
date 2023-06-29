import { computed, reactive, WritableComputedRef } from 'vue';
import {
  LocationQueryValue,
  LocationQueryValueRaw,
  useRoute,
  useRouter,
} from 'vue-router';
import { SortType } from '../components/table/table.interface';

export function defineParam<T extends LocationQueryValueRaw>(
  param: string,
  getter: (v: LocationQueryValue) => T,
  queryBehaviour: 'append' | 'replace' = 'append'
): WritableComputedRef<T> {
  const route = useRoute();
  const router = useRouter();
  return computed({
    get: () => getter(route.query[param] as LocationQueryValue),
    set: (value) => {
      router.push({
        query: {
          ...(queryBehaviour === 'append' && route.query),
          [param]: value || undefined,
        },
      });
    },
  });
}

export function definePaginatedQuery(defaultSortBy: string) {
  const route = useRoute();
  const router = useRouter();

  const limit = defineParam('limit', (v) => Number(v) || 25);
  const page = defineParam('page', (v) => Number(v) || 0);

  const sort = computed({
    get: () => ({
      by: (route.query.sortBy as string) || defaultSortBy,
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
