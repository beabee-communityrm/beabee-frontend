<template>
  <main
    class="min-h-screen bg-cover bg-fixed bg-center py-4"
    :style="backgroundStyle"
  >
    <AuthBox class="text-center">
      <AppLogo class="mb-5 inline-block w-28" />
      <AppTitle class="mb-5">{{ t('common.loading') }}</AppTitle>

      <font-awesome-icon
        class="text-[60px] text-body-60"
        :icon="faCircleNotch"
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
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import AppTitle from '../components/AppTitle.vue';

const { t } = useI18n();
</script>
