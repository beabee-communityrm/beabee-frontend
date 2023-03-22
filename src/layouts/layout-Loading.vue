<template>
  <main
    class="min-h-screen bg-cover bg-fixed bg-center py-4"
    :style="backgroundStyle"
  >
    <AuthBox class="text-center">
      <AppLogo class="mb-5 inline-block w-28" />
      <h1 class="mb-5 text-2.5xl">{{ t('common.loading') }}</h1>

      <font-awesome-icon
        class="text-[60px] text-body-60"
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
import { backgroundStyle } from '../store';
import AppLogo from '../components/AppLogo.vue';

const { t } = useI18n();
</script>
