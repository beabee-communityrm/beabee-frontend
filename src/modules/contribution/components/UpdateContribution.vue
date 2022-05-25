<template>
  <form class="mb-7 md:mb-12" @submit.prevent="submitContribution">
    <SectionTitle class="mb-2">{{ t('contribution.billing') }} </SectionTitle>

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
      :show-payment-method="!isAutoActiveMember"
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
      v-if="!isAutoActiveMember"
      :message="t('contribution.changeBankInfo')"
    />
  </form>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import InfoMessage from '../../components/InfoMessage.vue';
import SectionTitle from '../../components/SectionTitle.vue';
import Contribution from '../../components/contribution/Contribution.vue';
import AppButton from '../../components/forms/AppButton.vue';
import ProrateContribution from './components/ProrateContribution.vue';
import MessageBox from '../../components/MessageBox.vue';
import { useI18n } from 'vue-i18n';
import { useContribution } from '../use-contribution';

const validation = useVuelidate();

const { t } = useI18n();

const {
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
  hasManualType,
  isAutoActiveMember,
} = useContribution();
</script>
