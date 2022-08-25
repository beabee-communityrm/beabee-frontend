<template>
  <main
    class="min-h-screen bg-fixed bg-cover bg-center py-4"
    :style="backgroundStyle"
  >
    <AuthBox class="text-center">
      <AppLogo class="w-28 inline-block mb-5" />
      <h1 class="text-2.5xl mb-5">{{ t('common.loading') }}</h1>

      <font-awesome-icon
        class="text-[60px] text-body-40"
        :icon="['fas', 'circle-notch']"
        spin
      />

      <router-view />
    </AuthBox>
  </main>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AuthBox from '../components/AuthBox.vue';
import backgroundStyle from '../utils/backgroundStyle';
import AppLogo from '../components/AppLogo.vue';

const { t } = useI18n();
</script>
