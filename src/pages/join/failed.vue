<route lang="yaml">
name: joinFailed
meta:
  pageTitle: pageTitle.failed
  layout: Auth
  noAuth: true
</route>

<template>
  <JoinNotice show-pattern>
    <template #header>{{ t('join.errors.failed.title') }}</template>

    <template #content>
      <p class="mb-5">{{ t('join.errors.failed.message') }}</p>
    </template>

    <template #footer>
      <AppButton to="/join" class="w-full">
        {{ t('join.errors.failed.backToJoin') }}
      </AppButton>
    </template>
  </JoinNotice>
</template>

<script lang="ts" setup>
import JoinNotice from '../../components/pages/join/JoinNotice.vue';
import AppButton from '../../components/button/AppButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
