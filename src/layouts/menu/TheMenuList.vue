<template>
  <nav>
    <ul class="flex flex-col menu">
      <li v-for="(item, index) in menuItems" :key="index" class="mb-2">
        <template v-if="item.divider">
          <div class="pt-4 uppercase border-t text-grey-dark border-primary-40">
            {{ item.title }}
          </div>
        </template>

        <template v-else>
          <router-link
            class="nav-link"
            :class="itemClassses(item.isSubsection)"
            :to="item.href"
          >
            <font-awesome-icon
              class="menu-icon"
              :icon="['far', item.icon]"
              size="lg"
            />

            <span>{{ item.title }}</span>
          </router-link>
        </template>
      </li>

      <!-- logout -->
      <li class="mt-auto mb-6 sm:mb-10">
        <a
          class="nav-link cursor-pointer"
          :class="itemClassses(false)"
          @click="doLogout"
        >
          <font-awesome-icon class="menu-icon" :icon="['fas', 'sign-in-alt']" />

          <span>Log out</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { MenuItem } from './menu-list.interface';
import { useRouter } from 'vue-router';
import { logout } from '../../modules/auth/auth.service';

const router = useRouter();

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

const doLogout = () => {
  logout();
  localStorage.setItem('isAuthenticated', 'false');
  router.push('/auth/login');
};
</script>

<style scoped>
.router-link-active.menu-item {
  @apply bg-primary-20 text-primary;
}

.router-link-active.setting-item {
  @apply bg-primary-5 text-grey-darker;
}

.nav-link {
  @apply px-4 py-1.5 rounded flex items-center;
}

.menu-icon {
  @apply inline-block mr-2 h-4;
}

/* TODO: use better implementation
/* height of the screen minus the distance of item from top of the screen */
.menu {
  height: calc(100vh - 68px);
}

@media screen and (min-width: 768px) {
  .menu {
    height: calc(100vh - 208px);
  }
}
</style>
