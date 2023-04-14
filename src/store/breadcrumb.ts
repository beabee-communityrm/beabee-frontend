import { onBeforeMount, onBeforeUnmount, Ref, reactive } from 'vue';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Item {
  title: string;
  to?: string;
  icon?: IconDefinition;
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
