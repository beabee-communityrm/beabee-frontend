<template>
  <div class="flex-auto">
    <nav
      v-for="(section, index) in sections"
      :key="index"
      class="menu-section"
      :class="{ 'is-settings': section.type === 'settings' }"
    >
      <div v-if="index !== 0" class="py-2 border-t border-primary-40">
        {{ section.title }}
      </div>
      <ul class="flex flex-col">
        <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
          <router-link class="menu-item" :to="item.href">
            <TheMenuListItem :icon="['far', item.icon]" :title="item.title" />
          </router-link>
        </li>
      </ul>
    </nav>
    <nav
      v-if="currentUserCan(Role.Admin) && false"
      class="menu-section is-settings"
    >
      <div class="py-2 border-t border-primary-40">{{ t('menu.admin') }}</div>
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
import { logout } from '../../modules/auth/auth.service';
import { MenuSection } from './menu-list.interface';
import currentUserCan from '../../utils/currentUserCan';
import TheMenuListItem from './TheMenuListItem.vue';
import { Role } from '../../utils/enums/roles.enum';

const { t } = useI18n();

defineProps({
  sections: {
    type: Array as () => MenuSection[],
    default: () => [],
  },
});

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

.menu-item {
  @apply px-4 py-1.5 mb-2 rounded flex items-center hover:bg-primary-5 font-semibold;

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
