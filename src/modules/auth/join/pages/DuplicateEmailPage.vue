<template>
  <AuthBox>
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
  </AuthBox>
</template>

<script lang="ts" setup>
import AuthBox from '../../AuthBox.vue';
import JoinNotice from '../components/JoinNotice.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
