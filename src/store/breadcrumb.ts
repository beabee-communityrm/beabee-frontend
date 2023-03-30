import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue';

interface Item {
  title: string;
  to?: string;
  icon?: IconDefinition;
}

export const breadcrumbItems = ref<Ref<Item[]>[]>([]);

export const addBreadcrumb = (items: Ref<Item[]>): void => {
  onBeforeMount(() => {
    breadcrumbItems.value.push(items);
  });
  onBeforeUnmount(() => {
    breadcrumbItems.value.pop();
  });
};
