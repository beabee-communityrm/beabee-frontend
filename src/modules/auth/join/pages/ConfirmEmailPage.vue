<template>
  <AuthBox>
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
  </AuthBox>
</template>

<script lang="ts" setup>
import AuthBox from '../../AuthBox.vue';
import JoinNotice from '../components/JoinNotice.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
