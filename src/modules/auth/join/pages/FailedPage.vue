<template>
  <AuthBox>
    <JoinNotice show-pattern>
      <template #header>{{ t('join.errors.failed.title') }}</template>

      <template #content>
        <p class="mb-5">{{ t('join.errors.failed.message') }}</p>
      </template>

      <template #footer>
        <AppButton to="/join">
          {{ t('join.errors.failed.backToJoin') }}
        </AppButton>
      </template>
    </JoinNotice>
  </AuthBox>
</template>

<script lang="ts" setup>
import AuthBox from '../../AuthBox.vue';
import JoinNotice from '../components/JoinNotice.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
