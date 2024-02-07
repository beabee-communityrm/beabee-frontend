<template>
  <ul
    class="flex overflow-x-scroll mb-4 -mx-4 px-4 border-y border-primary-40 text-sm md:mb-6 select-none"
  >
    <li class="flex-none" v-for="item in items" :key="item.id">
      <router-link
        :to="item.to"
        class="flex items-baseline px-4 py-6 font-semibold text-body-80"
        :class="
          selected === item.id && 'font-bold text-link bg-primary'
        "
      >
        <span class="">
          {{ item.label }}
        </span>

        <span
          v-if="item.count !== undefined"
          class="ml-2 text-xs bg-white rounded-xl p-1"
          :class="
            selected ? 'text-body' : 'text-body-60 group-hover:text-body-80'
          "
          >{{ item.count }}</span
        >
      </router-link>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import type { TabItem } from './tabs.interface';

defineProps<{
  items: TabItem[];
  selected: string | null;
}>();
</script>
