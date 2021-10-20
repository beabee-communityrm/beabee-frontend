<template>
  <JoinBox>
    <JoinNotice show-pattern>
      <template #header>{{ t('join.errors.failed.title') }}</template>

      <template #content>
        <p class="mb-5">{{ t('join.errors.failed.message') }}</p>
      </template>

      <template #footer>
        <AppButton to="/join" full-width class="font-bold">
          {{ t('join.errors.failed.backToJoin') }}
        </AppButton>
      </template>
    </JoinNotice>
  </JoinBox>
</template>

<script lang="ts" setup>
import JoinBox from '../components/JoinBox.vue';
import JoinNotice from '../components/JoinNotice.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
