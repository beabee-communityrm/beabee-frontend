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
          <a
            class="block px-4 py-1.5 rounded"
            :class="itemClassses(item.isSubsection)"
            :href="item.href"
          >
            <font-awesome-icon
              class="inline-block mr-2"
              :icon="['far', item.icon]"
              size="lg"
            />
            <span>{{ item.title }}</span>
          </a>
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
    ? ['text-grey-dark', 'hover:bg-grey-lighter']
    : ['text-primary-80', 'hover:bg-primary-5'];
  return classses;
};
</script>
