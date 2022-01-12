<template>
  <div class="mb-5">
    <PageTitle :title="t('menu.contribution')" />
  </div>

  <div v-if="!isIniting" class="grid grid-cols-12">
    <div class="col-span-12 md:col-span-7 lg:col-span-5">
      <ContributionBox
        v-if="!hasNoneType"
        :status="currentContribution.membershipStatus"
        :amount="currentContribution.amount"
        :period="period"
        :expiry-date="currentContribution.membershipExpiryDate"
        class="mb-9"
      />

      <form v-if="showContributionForm" class="mb-7 md:mb-12" @submit.prevent>
        <SectionTitle class="mb-2"
          >{{ t('contribution.billing') }}
        </SectionTitle>

        <p v-if="hasManualType" class="mb-4">
          {{ t('contribution.manualPayment') }}
        </p>

        <!-- users can't change period on an active GoCardless contribution -->
        <ContributionPeriod
          v-if="!isActiveMemberWithGoCardless"
          class="mb-6"
          :periods="contributionContent.periods"
          :selected-period="newContribution.period"
          @change-period="changePeriod"
        />

        <ContributionAmount
          v-model.number="newContribution.amount"
          :is-monthly="isMonthly"
          :min-amount="minAmount"
          :defined-amounts="definedAmounts"
          class="mb-5"
        />

        <ContributionFee
          v-if="isMonthly"
          v-model="newContribution.payFee"
          :amount="newContribution.amount"
          :fee="fee"
          :force="shouldForceFee"
        />

        <AppButton
          :disabled="isContributionFormInvalid"
          type="submit"
          variant="link"
          class="mb-4 w-full"
          :loading="updateContributionLoading"
          @click="submitContribution"
        >
          {{ contributionButtonText }}
        </AppButton>

        <InfoMessage
          v-if="!isActiveMemberWithGoCardless"
          :message="t('contribution.changeBankInfo')"
        />
      </form>

      <template v-if="hasPaymentSource">
        <SectionTitle class="mb-4">{{
          t('contribution.bankAccount')
        }}</SectionTitle>

        <PaymentSource
          class="mb-7 md:mb-12"
          :loading="paymentSourceLoading"
          :payment-source="paymentSource"
          :has-error="cantUpdatePaymentSource"
          @update-payment-source="updatePaymentSource"
        />
      </template>

      <template v-if="isActiveMemberWithGoCardless">
        <SectionTitle class="mb-4">{{
          t('contribution.cancelContribution')
        }}</SectionTitle>

        <CancelContribution
          class="mb-9 md:mb-0"
          :expiry-date="currentContribution.membershipExpiryDate"
        />
      </template>
    </div>
  </div>

  <div class="text-center md:hidden">
    <router-link class="underline text-sm" to="/profile">
      ←{{ t('common.backToHome') }}
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import InfoMessage from '../../components/InfoMessage.vue';
import ContributionBox from './components/ContributionBox.vue';
import SectionTitle from '../../components/SectionTitle.vue';
import ContributionPeriod from './components/ContributionPeriod.vue';
import ContributionAmount from './components/ContributionAmount.vue';
import ContributionFee from './components/ContributionFee.vue';
import PaymentSource from './components/PaymentSource.vue';
import CancelContribution from './components/CancelContribution.vue';
import AppButton from '../../components/forms/AppButton.vue';
import { computed, onBeforeMount } from 'vue';
import { useContribution } from './use-contribution';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const {
  isIniting,
  initContributionPage,
  currentContribution,
  newContribution,
  contributionContent,
  isMonthly,
  changePeriod,
  shouldForceFee,
  minAmount,
  definedAmounts,
  fee,
  isContributionFormInvalid,
  submitContribution,
  showContributionForm,
  contributionButtonText,
  paymentSourceLoading,
  updatePaymentSource,
  hasNoneType,
  hasManualType,
  isActiveMemberWithGoCardless,
  hasPaymentSource,
  paymentSource,
  cantUpdatePaymentSource,
  updateContributionLoading,
} = useContribution();

const period = computed(() =>
  t(isMonthly.value ? 'common.month' : 'common.year')
);

onBeforeMount(() => {
  initContributionPage();
});
</script>
