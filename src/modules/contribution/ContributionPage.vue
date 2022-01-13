<template>
  <div class="mb-5">
    <PageTitle :title="t('menu.contribution')" />
  </div>

  <div v-if="!isIniting" class="grid grid-cols-12">
    <div class="col-span-12 md:col-span-7 lg:col-span-5">
      <ContributionBox
        v-if="!hasNoneType"
        :contribution="currentContribution"
        class="mb-9"
      />

      <form class="mb-7 md:mb-12" @submit.prevent>
        <SectionTitle class="mb-2"
          >{{ t('contribution.billing') }}
        </SectionTitle>

        <div v-if="currentContribution.nextAmount" class="mb-5">
          <AppAlert>
            {{
              t('contribution.nextAmountChanging', {
                nextAmount: n(currentContribution.nextAmount, 'currency'),
                renewalDate: formattedRenewalDate,
              })
            }}
          </AppAlert>
        </div>

        <p v-if="hasManualType" class="mb-4">
          {{ t('contribution.manualPayment') }}
        </p>

        <Contribution
          v-model="newContribution"
          v-model:isValid="isContributionValid"
          :content="contributionContent"
          :show-period="!isActiveMemberWithGoCardless"
        />

        <ProrateContribution
          v-if="showProrateOptions"
          v-model="newContribution.prorate"
          :new-amount="newContribution.amount"
          :old-amount="currentContribution.amount!"
          :renewal-date="currentContribution.renewalDate!"
        />

        <MessageBox v-if="cantUpdateContribution" class="mb-4" type="error">
          {{ t('contribution.contributionUpdateError') }}
        </MessageBox>

        <AppButton
          :disabled="
            currentContribution.amount === newContribution.amount ||
            !isContributionValid
          "
          type="submit"
          variant="link"
          class="mb-4 w-full"
          :loading="submitContributionLoading"
          @click="submitContribution"
        >
          {{ contributionButtonText }}
        </AppButton>

        <InfoMessage
          v-if="!isActiveMemberWithGoCardless"
          :message="t('contribution.changeBankInfo')"
        />
      </form>

      <template v-if="currentContribution.paymentSource">
        <SectionTitle class="mb-4">{{
          t('contribution.bankAccount')
        }}</SectionTitle>

        <PaymentSource
          class="mb-7 md:mb-12"
          :loading="updatePaymentSourceLoading"
          :payment-source="currentContribution.paymentSource"
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
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContribution } from './use-contribution';

import ContributionBox from './components/ContributionBox.vue';
import CancelContribution from './components/CancelContribution.vue';
import PaymentSource from './components/PaymentSource.vue';

import PageTitle from '../../components/PageTitle.vue';
import InfoMessage from '../../components/InfoMessage.vue';
import SectionTitle from '../../components/SectionTitle.vue';
import Contribution from '../../components/contribution/Contribution.vue';
import AppButton from '../../components/forms/AppButton.vue';
import ProrateContribution from './components/ProrateContribution.vue';
import AppAlert from '../../components/AppAlert.vue';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import MessageBox from '../../components/MessageBox.vue';

const { t, n } = useI18n();

const isContributionValid = ref(false);

const {
  isIniting,
  initContributionPage,
  currentContribution,
  newContribution,
  contributionContent,
  submitContribution,
  submitContributionLoading,
  cantUpdateContribution,
  showProrateOptions,
  contributionButtonText,
  updatePaymentSource,
  updatePaymentSourceLoading,
  cantUpdatePaymentSource,
  hasNoneType,
  hasManualType,
  isActiveMemberWithGoCardless,
} = useContribution();

const formattedRenewalDate = computed(
  () =>
    currentContribution.renewalDate &&
    formatLocale(currentContribution.renewalDate, 'PPP')
);

onBeforeMount(() => {
  initContributionPage();
});
</script>
