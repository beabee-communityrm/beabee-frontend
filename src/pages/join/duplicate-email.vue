<route lang="yaml">
name: duplicateEmail
meta:
  layout: Auth
  noAuth: true
  pageTitle: pageTitle.duplicateEmail
</route>

<template>
  <JoinNotice>
    <template #header>{{ t('join.errors.duplicateEmail.title') }}</template>

    <template #content>
      <p class="mb-5">{{ t('join.errors.duplicateEmail.message') }}</p>
    </template>

    <template #footer>
      <AppButton to="/auth/login" class="mb-2 w-full">
        {{ t('join.login') }}
      </AppButton>

      <div class="text-center">
        <AppButton to="/join" variant="text" size="sm">
          {{ t('join.errors.failed.backToJoin') }}
        </AppButton>
      </div>
    </template>
  </JoinNotice>
</template>

<script lang="ts" setup>
import JoinNotice from '../../components/pages/join/JoinNotice.vue';
import AppButton from '../../components/button/AppButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
