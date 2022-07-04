<template>
  <nav
    class="px-4"
    :class="section.type === 'main' ? 'text-primary-80' : 'text-grey-dark'"
  >
    <div v-if="!isFirst" class="border-t border-primary-40 my-2" />
    <div v-if="section.title" class="pb-2">
      {{ t(section.title) }}
    </div>
    <ul class="flex flex-col">
      <template v-for="item in section.items" :key="item.href">
        <li>
          <router-link :to="item.href">
            <TheMenuListItem
              :icon="item.icon"
              :title="t(item.title)"
              :type="section.type"
              :is-active="
                item.isActive
                  ? item.isActive.test(route.path)
                  : item.href === route.path
              "
            />
          </router-link>
        </li>
      </template>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { MenuSection } from './menu-list.interface';
import TheMenuListItem from './TheMenuListItem.vue';

defineProps<{
  section: MenuSection;
  isFirst: boolean;
}>();

const { t } = useI18n();

const route = useRoute();
</script>
