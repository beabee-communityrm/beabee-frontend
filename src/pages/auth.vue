<route lang="yaml">
meta:
  layout: Auth
</route>
<template>
  <div class="mb-5 px-4">
    <AppButton :href="generalContent.siteUrl" size="sm">
      ←
      {{ t('login.backTo', { newsroomName: generalContent.organisationName }) }}
    </AppButton>
  </div>

  <AuthBox>
    <div class="mb-10 flex justify-center">
      <AppLogo class="h-[120px]" />
    </div>

    <router-view />
  </AuthBox>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { generalContent } from '../store';
import AppButton from '../components/forms/AppButton.vue';
import AuthBox from '../components/AuthBox.vue';
import AppLogo from '../components/AppLogo.vue';

const { t } = useI18n();
</script>
