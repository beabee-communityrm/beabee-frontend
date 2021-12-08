<template>
  <AuthBox>
    <form @submit.prevent>
      <JoinHeader
        class="mb-3"
        :title="joinContent.title"
        :description="joinContent.subtitle"
      />

      <h3 class="font-semibold text-lg mb-1">Contribution</h3>

      <div v-if="joinContent.showNoContribution" class="mb-4">
        <label>
          <input v-model="noContribution" type="checkbox" />
          {{ t("I don't want to contribute today") }}
        </label>
      </div>

      <ContributionPeriod
        v-if="!noContribution"
        class="mb-6"
        :periods="joinContent.periods"
        :selected-period="signUpData.period"
        @change-period="changePeriod"
      />

      <ContributionAmount
        v-if="!noContribution"
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
        v-if="!noContribution && isMonthly && joinContent.showAbsorbFee"
        v-model="signUpData.payFee"
        :amount="signUpData.amount"
        :fee="fee"
        :force="shouldForceFee"
      />

      <MessageBox v-if="hasJoinError" class="mb-4" />

      <AppButton
        :disabled="isJoinFormInvalid"
        :loading="loading"
        variant="link"
        type="submit"
        class="mb-4 w-full"
        @click="submitSignUp"
      >
        {{
          noContribution
            ? 'Join now'
            : t('join.contribute', {
                amount: n(totalAmount, 'currency'),
                period:
                  signUpData.period === 'monthly'
                    ? t('common.month')
                    : t('common.year'),
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
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const { t, n } = useI18n();

const noContribution = ref(false);

const {
  signUpData,
  totalAmount,
  definedAmounts,
  minAmount,
  isMonthly,
  isJoinFormInvalid,
  hasJoinError,
  loading,
  submitSignUp,
  joinContent,
  setJoinContent,
  changePeriod,
  shouldForceFee,
  fee,
} = useJoin();

const route = useRoute();

onBeforeMount(() => {
  setJoinContent(route.query);
});
</script>
