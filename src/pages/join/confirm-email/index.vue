<route lang="yaml">
name: confirmEmail
meta:
  layout: Auth
  noAuth: true
  pageTitle: pageTitle.confirmEmail
</route>

<template>
  <JoinNotice>
    <template #header>{{ t('join.errors.confirmEmail.title') }}</template>

    <template #content>
      <p class="mb-3">
        {{ t('join.errors.confirmEmail.message') }}
      </p>
    </template>

    <template #footer>
      <p class="font-bold">{{ t('join.errors.confirmEmail.proceed') }}</p>
    </template>
  </JoinNotice>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import JoinNotice from '../../../components/pages/join/JoinNotice.vue';
const { t } = useI18n();
</script>
