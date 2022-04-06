<template>
  <AppSelect v-model="selectedItem" :items="items" class="mb-4 md:hidden" />
  <ul class="border-primary-40 border-b mb-4 md:-mx-2 hidden md:flex text-sm">
    <li v-for="item in items" :key="item.id">
      <router-link
        :to="item.to"
        class="relative inline-block p-3"
        :class="
          selected === item.id && 'text-link font-bold border-b-2 border-link'
        "
      >
        <span class="font-bold opacity-0">
          {{ item.label }}
          <span v-if="item.count !== undefined" class="ml-1">
            ({{ item.count }})
          </span>
        </span>
        <span
          class="
            absolute
            inset-0
            flex
            items-center
            justify-center
            hover:font-bold
          "
        >
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
