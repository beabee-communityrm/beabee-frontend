<template>
  <div class="flex-auto">
    <nav
      v-for="(section, index) in sections"
      :key="index"
      class="menu-section"
      :class="{ 'is-settings': section.type === 'settings' }"
    >
      <div v-if="index !== 0" class="menu-title">
        {{ section.title }}
      </div>
      <ul class="flex flex-col">
        <template v-for="(item, itemIndex) in section.items" :key="itemIndex">
          <li v-if="!item.role || currentUserCan(item.role).value">
            <router-link class="menu-item" :to="item.href">
              <TheMenuListItem :icon="item.icon" :title="item.title" />
            </router-link>
          </li>
        </template>
      </ul>
    </nav>
    <nav v-if="canAdmin" class="menu-section is-settings">
      <div class="menu-title">{{ t('menu.admin') }}</div>
      <a href="/members" class="menu-item cursor-pointer">
        <TheMenuListItem
          :icon="['fa', 'users']"
          :title="t('menu.adminDashboard')"
        />
      </a>
    </nav>
  </div>
  <div class="menu-logout">
    <a class="menu-item cursor-pointer" @click="doLogout">
      <TheMenuListItem
        :icon="['fa', 'sign-in-alt']"
        :title="t('menu.logout')"
      />
    </a>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { MenuSection } from './menu-list.interface';
import currentUserCan, { canAdmin } from '../../utils/currentUserCan';
import TheMenuListItem from './TheMenuListItem.vue';
import { logout } from '../../utils/api/auth';

const { t } = useI18n();

defineProps<{
  sections: MenuSection[];
}>();

const router = useRouter();
const doLogout = () => {
  logout();
  router.push('/auth/login');
};
</script>

<style scoped>
.menu-section {
  @apply text-primary-80;
}

.menu-title {
  @apply py-1.5 border-t border-primary-40;
}

.menu-item {
  @apply px-1 py-1.5 mb-1.5 rounded flex items-center hover:bg-primary-5 font-semibold;

  &.router-link-active {
    @apply bg-primary-20;
  }
}

.menu-section.is-settings {
  @apply text-grey-dark;

  & .menu-item {
    @apply hover:bg-grey-lighter;

    &.router-link-active {
      @apply bg-primary-5 text-grey-darker;
    }
  }
}

.menu-logout {
  @apply fixed bottom-0 left-0 p-4 border-t border-primary-40 bg-white;

  width: 240px;
}
</style>
