<template>
  <div class="mb-5">
    <PageTitle :title="t('menu.contribution')" />
  </div>

  <div v-if="!isIniting" class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
    <div>
      <AppAlert v-if="updatedPaymentSource" class="mb-8">{{
        t('contribution.updatedPaymentSource')
      }}</AppAlert>
      <AppAlert v-if="startedContribution" class="mb-8">{{
        t('contribution.startedContribution')
      }}</AppAlert>

      <ContributionBox :contribution="currentContribution" class="mb-9" />

      <form class="mb-7 md:mb-12" @submit.prevent="submitContribution">
        <SectionTitle class="mb-2"
          >{{ t('contribution.billing') }}
        </SectionTitle>

        <p v-if="hasManualType" class="mb-4">
          {{ t('contribution.manualPayment') }}
        </p>

        <Contribution
          v-model:amount="newContribution.amount"
          v-model:payFee="newContribution.payFee"
          v-model:period="newContribution.period"
          v-model:paymentMethod="newContribution.paymentMethod"
          :content="contributionContent"
          :show-period="showChangePeriod"
        />

        <ProrateContribution
          v-if="showProrateOptions"
          v-model="newContribution.prorate"
          :new-amount="newContribution.amount"
          :old-amount="currentContribution.amount!"
          :renewal-date="currentContribution.renewalDate!"
        />

        <MessageBox v-if="hasUpdatedContribution" class="mb-4" type="success">
          {{ t('contribution.updatedContribution') }}
        </MessageBox>

        <MessageBox v-if="cantUpdateContribution" class="mb-4" type="error">
          {{ t('contribution.contributionUpdateError') }}
        </MessageBox>

        <AppButton
          :disabled="!canSubmitContribution || validation.$invalid"
          type="submit"
          variant="link"
          class="mb-4 w-full"
          :loading="submitContributionLoading"
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
    <PaymentsHistory id="me" class="lg:ml-10" />
  </div>

  <div class="text-center md:hidden">
    <router-link class="underline text-sm" to="/profile">
      ←{{ t('common.backToHome') }}
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core';
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
import MessageBox from '../../components/MessageBox.vue';
import PaymentsHistory from './components/PaymentsHistory.vue';

const { t } = useI18n();

const route = useRoute();
const updatedPaymentSource = route.query.updatedPaymentSource !== undefined;
const startedContribution = route.query.startedContribution !== undefined;

const validation = useVuelidate();

const {
  isIniting,
  initContributionPage,
  currentContribution,
  newContribution,
  contributionContent,
  canSubmitContribution,
  submitContribution,
  submitContributionLoading,
  cantUpdateContribution,
  hasUpdatedContribution,
  showChangePeriod,
  showProrateOptions,
  contributionButtonText,
  updatePaymentSource,
  updatePaymentSourceLoading,
  cantUpdatePaymentSource,
  hasManualType,
  isActiveMemberWithGoCardless,
} = useContribution();

onBeforeMount(() => {
  initContributionPage();
});
</script>
