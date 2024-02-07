<template>
  <div class="flex-none md:basis-menu">
    <AppTabsCompact v-model="currentItem" :items="items" class="md:hidden" />
    <AppVTabs v-model="currentItem" :items="items" class="hidden md:block" />
  </div>
  <div class="flex flex-auto flex-col gap-6 md:flex-row">
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import AppSelect from './forms/AppSelect.vue';
import AppVTabs from './tabs/AppVTabs.vue';
import { type TabItem } from './tabs/tabs.interface';
import AppTabsCompact from './tabs/AppTabsCompact.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  items: TabItem[];
  modelValue: string;
}>();

const currentItem = computed({
  get: () => props.modelValue,
  set: (item) => emit('update:modelValue', item),
});
</script>
