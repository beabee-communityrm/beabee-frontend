<template>
  <JoinBox>
    <JoinNotice>
      <template #header>{{ t('join.errors.confirmEmail.title') }}</template>

      <template #content>
        <p class="mb-3">
          {{
            t('join.errors.confirmEmail.message', { email: signUpData.email })
          }}
        </p>
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
import { useJoin } from '../use-join';

const { signUpData } = useJoin();
const { t } = useI18n();
</script>
