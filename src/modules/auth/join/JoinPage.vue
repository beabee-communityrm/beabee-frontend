<template>
  <AuthBox>
    <form @submit.prevent>
      <JoinHeader
        class="mb-3"
        :title="joinContent.title"
        :sub-title="joinContent.subtitle"
      />

      <ContributionPeriod
        class="mb-6"
        :periods="joinContent.periods"
        :selected-period="signUpData.period"
        @change-period="changePeriod"
      />

      <ContributionAmount
        v-model.number="signUpData.amount"
        :is-monthly="isMonthly"
        :min-amount="minAmount"
        :defined-amounts="definedAmounts"
        class="mb-5"
      />

      <AccountSection
        @update-email="signUpData.email = $event"
        @update-password="signUpData.password = $event"
      />

      <ContributionFee
        v-if="isMonthly"
        v-model="signUpData.payFee"
        :amount="signUpData.amount"
        :fee="fee"
        :force="shouldForceFee"
      />

      <MessageBox v-if="hasJoinError" class="mb-4" />

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
  </AuthBox>
</template>

<script lang="ts" setup>
import JoinHeader from './components/JoinHeader.vue';
import ContributionPeriod from '../../contribution/components/ContributionPeriod.vue';
import ContributionAmount from '../../contribution/components/ContributionAmount.vue';
import AuthBox from '../AuthBox.vue';
import AccountSection from './components/AccountSection.vue';
import ContributionFee from '../../contribution/components/ContributionFee.vue';
import JoinFooter from './components/JoinFooter.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { onBeforeMount } from '@vue/runtime-core';
import { useJoin } from './use-join';
import { useI18n } from 'vue-i18n';

const { t, n } = useI18n();

const {
  signUpData,
  totalAmount,
  definedAmounts,
  minAmount,
  isMonthly,
  isJoinFormInvalid,
  hasJoinError,
  submitSignUp,
  joinContent,
  setJoinContent,
  changePeriod,
  shouldForceFee,
  fee,
} = useJoin();

onBeforeMount(() => {
  setJoinContent();
});
</script>
