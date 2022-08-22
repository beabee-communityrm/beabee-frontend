<template>
  <main
    class="min-h-screen bg-fixed bg-cover bg-center py-4"
    :style="backgroundStyle"
  >
    <AuthBox class="text-center">
      <img
        class="w-28 inline-block mb-5"
        src="../assets/images/logo.png"
        :alt="generalContent.organisationName"
      />
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
import { generalContent } from '../store';
import backgroundStyle from '../utils/backgroundStyle';

const { t } = useI18n();
</script>
