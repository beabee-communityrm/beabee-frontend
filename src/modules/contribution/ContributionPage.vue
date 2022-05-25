<template>
  <PageTitle :title="t('menu.contribution')" />

  <div v-if="!isIniting" class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
    <div>
      <AppAlert v-if="updatedPaymentSource" class="mb-8">{{
        t('contribution.updatedPaymentSource')
      }}</AppAlert>
      <AppAlert v-if="startedContribution" class="mb-8">{{
        t('contribution.startedContribution')
      }}</AppAlert>

      <ContributionBox :contribution="currentContribution" class="mb-9" />

      <UpdateContribution />

      <PaymentSource
        v-if="currentContribution.paymentSource"
        class="mb-7 md:mb-12"
        :email="email"
        :payment-source="currentContribution.paymentSource"
      />

      <CancelContribution :contribution="currentContribution" />
    </div>
    <div>
      <PaymentsHistory id="me" class="lg:ml-10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useContribution } from './use-contribution';

import ContributionBox from './components/ContributionBox.vue';
import CancelContribution from './components/CancelContribution.vue';
import PaymentSource from './components/PaymentSource.vue';

import PageTitle from '../../components/PageTitle.vue';
import AppAlert from '../../components/AppAlert.vue';
import PaymentsHistory from './components/PaymentsHistory.vue';
import { currentUser } from '../../store';
import UpdateContribution from './components/UpdateContribution.vue';

const { t } = useI18n();

const route = useRoute();
const updatedPaymentSource = route.query.updatedPaymentSource !== undefined;
const startedContribution = route.query.startedContribution !== undefined;

const email = computed(() =>
  currentUser.value ? currentUser.value.email : ''
);

const { isIniting, initContributionPage, currentContribution } =
  useContribution();

onBeforeMount(() => {
  initContributionPage();
});
</script>
