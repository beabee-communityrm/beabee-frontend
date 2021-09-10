<template>
  <nav>
    <ul>
      <li v-for="(item, index) in menuItems" :key="index" class="mb-2">
        <template v-if="item.divider">
          <div class="pt-4 uppercase border-t text-grey-dark border-primary-40">
            {{ item.title }}
          </div>
        </template>

        <template v-else>
          <router-link
            class="block px-4 py-1.5 rounded"
            :class="itemClassses(item.isSubsection)"
            :to="item.href"
          >
            <font-awesome-icon
              class="inline-block mr-2"
              :icon="['far', item.icon]"
              size="lg"
            />
            <span>{{ item.title }}</span>
          </router-link>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { MenuItem } from './menu-list.interface';

defineProps({
  menuItems: {
    type: Array as () => MenuItem[],
    default: () => [],
  },
});

const itemClassses = (isSubsection: boolean | undefined) => {
  const classses = isSubsection
    ? ['setting-item', 'text-grey-dark', 'hover:bg-grey-lighter']
    : ['menu-item', 'text-primary-80', 'hover:bg-primary-5'];
  return classses;
};
</script>

<style scoped>
.router-link-active.menu-item {
  @apply bg-primary-20 text-primary;
}

.router-link-active.setting-item {
  @apply bg-primary-5 text-grey-darker;
}
</style>
