<template>
  <div class="mb-5">
    <PageTitle :title="t('menu.contribution')" />
  </div>

  <div v-if="!isIniting" class="grid grid-cols-12">
    <div class="col-span-12 md:col-span-7 lg:col-span-5">
      <AppAlert v-if="updatedPaymentSource" class="mb-8">{{
        t('contribution.updatedPaymentSource')
      }}</AppAlert>
      <AppAlert v-if="startedContribution" class="mb-8">{{
        t('contribution.startedContribution')
      }}</AppAlert>

      <ContributionBox :contribution="currentContribution" class="mb-9" />

      <form class="mb-7 md:mb-12" @submit.prevent>
        <SectionTitle class="mb-2"
          >{{ t('contribution.billing') }}
        </SectionTitle>

        <p v-if="hasManualType" class="mb-4">
          {{ t('contribution.manualPayment') }}
        </p>

        <Contribution
          v-model="newContribution"
          v-model:isValid="isContributionValid"
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
          :disabled="!canSubmitContribution"
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

  <Footer />
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
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
import Footer from '../../components/Footer.vue';

const { t } = useI18n();

const route = useRoute();
const updatedPaymentSource = route.query.updatedPaymentSource !== undefined;
const startedContribution = route.query.startedContribution !== undefined;

const isContributionValid = ref(false);

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
  hasNoneType,
  hasManualType,
  isActiveMemberWithGoCardless,
} = useContribution();

onBeforeMount(() => {
  initContributionPage();
});
</script>
