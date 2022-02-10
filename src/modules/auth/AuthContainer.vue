<template>
  <div v-if="isAuthPath" class="px-4 mb-5">
    <AppButton :href="newsroomLink" size="sm">
      ← {{ t('login.backTo', { newsroomName }) }}
    </AppButton>
  </div>

  <AuthBox>
    <div class="flex justify-center mb-10">
      <img
        class="logo"
        src="../../assets/images/logo.png"
        :alt="newsroomName"
      />
    </div>

    <router-view />
  </AuthBox>
</template>

<script lang="ts" setup>
import AuthBox from './AuthBox.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';
import AppButton from '../../components/forms/AppButton.vue';

const { t } = useI18n();
const route = useRoute();

const isAuthPath = computed(() => route.path.startsWith('/auth'));

const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;
const newsroomLink = import.meta.env.VITE_NEWSROOM_LINK;
</script>

<style scoped>
.auth {
  background-image: url('../assets/images/auth-bg.jpg');
}

.logo {
  height: 120px;
}
</style>
