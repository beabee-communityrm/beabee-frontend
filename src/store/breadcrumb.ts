import { onBeforeMount, onBeforeUnmount, Ref, reactive } from 'vue';

interface Item {
  title: string;
  to?: string;
  icon?: string;
}

export const breadcrumbItems = reactive<Ref<Item[]>[]>([]);

export const addBreadcrumb = (items: Ref<Item[]>): void => {
  onBeforeMount(() => {
    breadcrumbItems.push(items);
  });
  onBeforeUnmount(() => {
    breadcrumbItems.pop();
  });
};
