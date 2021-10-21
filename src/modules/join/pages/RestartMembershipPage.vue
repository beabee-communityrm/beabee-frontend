<template>
  <JoinBox>
    <JoinNotice>
      <template #header>{{
        t('join.errors.restartMembership.title')
      }}</template>

      <template #content>
        <p class="mb-3" v-html="t('join.errors.restartMembership.message')" />
      </template>

      <template #footer>
        <p class="font-bold">{{ t('join.errors.confirmEmail.proceed') }}</p>
      </template>
    </JoinNotice>
  </JoinBox>
</template>

<script lang="ts" setup>
import JoinBox from '../components/JoinBox.vue';
import JoinNotice from '../components/JoinNotice.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
