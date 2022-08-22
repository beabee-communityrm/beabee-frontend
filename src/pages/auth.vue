<route lang="yaml">
meta:
  layout: Auth
</route>
<template>
  <div class="px-4 mb-5">
    <AppButton :href="generalContent.siteUrl" size="sm">
      ←
      {{ t('login.backTo', { newsroomName: generalContent.organisationName }) }}
    </AppButton>
  </div>

  <AuthBox>
    <div class="flex justify-center mb-10">
      <img
        class="h-[120px]"
        src="../assets/images/logo.png"
        :alt="generalContent.organisationName"
      />
    </div>

    <router-view />
  </AuthBox>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { generalContent } from '../store';
import AppButton from '../components/forms/AppButton.vue';
import AuthBox from '../components/AuthBox.vue';

const { t } = useI18n();
</script>
