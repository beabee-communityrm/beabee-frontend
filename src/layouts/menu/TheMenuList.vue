<template>
  <div class="flex-auto">
    <TheMenuListSection
      v-for="(section, index) in menu"
      :key="index"
      :section="section"
      :is-first="index === 0"
    />
    <div v-if="canAdmin" class="bg-primary-10 py-2 mt-2">
      <TheMenuListSection
        v-for="(section, index) in adminMenu"
        :key="index"
        :section="section"
        :is-first="index === 0"
      />
    </div>
  </div>
  <div
    class="
      fixed
      bottom-0
      left-0
      px-1
      py-2
      border-t border-primary-40
      bg-white
      w-menu
      md:w-16
      xl:w-menu
    "
  >
    <a class="cursor-pointer" @click="doLogout">
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
import TheMenuListItem from './TheMenuListItem.vue';
import TheMenuListSection from './TheMenuListSection.vue';
import { canAdmin } from '../../utils/currentUserCan';
import { logout } from '../../utils/api/auth';

import { menu, adminMenu } from './menu-list';

const { t } = useI18n();

const router = useRouter();
const doLogout = () => {
  logout();
  router.push('/auth/login');
};
</script>
