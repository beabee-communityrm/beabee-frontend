<template>
  <AppSelect v-model="selectedItem" :items="items" class="mb-4 md:hidden" />
  <ul
    class="mb-4 hidden border-b border-primary-40 text-sm md:-mx-2 md:mb-6 md:flex"
  >
    <li v-for="item in items" :key="item.id">
      <router-link
        :to="item.to"
        class="relative inline-block p-2"
        :class="
          selected === item.id && 'border-text border-b-2 font-bold text-body'
        "
      >
        <span class="text-body-80 hover:text-body">
          {{ item.label }}
          <span v-if="item.count !== undefined" class="ml-1">
            ({{ item.count }})
          </span>
        </span>
      </router-link>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { TabItem } from './tabs.interface';
import AppSelect from '../forms/AppSelect.vue';

const router = useRouter();

const props = defineProps<{
  items: TabItem[];
  selected: string | null;
}>();

const selectedItem = computed({
  get: () => props.selected,
  set: (itemId) => {
    const item = props.items.find((item) => item.id === itemId);
    if (item?.to) {
      router.push(item.to);
    }
  },
});
</script>
