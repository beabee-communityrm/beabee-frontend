<template>
  <JoinBox>
    <form @submit.prevent>
      <JoinHeader
        class="mb-3"
        :title="joinContent.title"
        :sub-title="joinContent.subtitle"
      />

      <JoinPeriod class="mb-6" @change-period="changePeriod" />

      <JoinAmount v-model="signUpData.amount" class="mb-5" />

      <AccountSection
        @update-email="signUpData.email = $event"
        @update-password="signUpData.password = $event"
      />

      <PaymentSection v-if="isMonthly" />

      <error-aggregator v-if="hasJoinError" class="mb-4" />

      <AppButton
        :disabled="isJoinFormInvalid"
        variant="link"
        class="mb-4"
        @click="submitSignUp"
      >
        {{
          t('join.contribute', {
            amount: n(totalAmount, 'currency'),
            period: signUpData.period,
          })
        }}
      </AppButton>

      <JoinFooter :privacy-link="joinContent.privacyLink" />
    </form>
  </JoinBox>
</template>

<script lang="ts" setup>
import JoinHeader from './components/JoinHeader.vue';
import JoinPeriod from './components/JoinPeriod.vue';
import JoinAmount from './components/JoinAmount.vue';
import JoinBox from './components/JoinBox.vue';
import AccountSection from './components/AccountSection.vue';
import PaymentSection from './components/PaymentSection.vue';
import JoinFooter from './components/JoinFooter.vue';
import AppButton from '../../components/forms/AppButton.vue';
import ErrorAggregator from '../../components/forms/ErrorAggregator.vue';
import { onBeforeMount } from '@vue/runtime-core';
import { useJoin } from './use-join';
import { useI18n } from 'vue-i18n';

const { t, n } = useI18n();

const {
  signUpData,
  totalAmount,
  isMonthly,
  isJoinFormInvalid,
  hasJoinError,
  submitSignUp,
  joinContent,
  setJoinContent,
  changePeriod,
} = useJoin();

onBeforeMount(setJoinContent);
</script>
