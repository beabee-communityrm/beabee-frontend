<route lang="yaml">
name: profileContribution
meta:
  pageTitle: menu.contribution
</route>

<template>
  <PageTitle :title="t('menu.contribution')" />

  <div v-if="!isIniting" class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <AppAlert v-if="updatedPaymentSource" class="mb-8">{{
        t('contribution.updatedPaymentSource')
      }}</AppAlert>
      <AppAlert v-if="startedContribution" class="mb-8">{{
        t('contribution.startedContribution')
      }}</AppAlert>

      <ContributionBox :contribution="contribution" class="mb-9" />

      <UpdateContribution
        v-model="contribution"
        :content="content"
        class="mb-7 md:mb-9"
      />

      <PaymentSource
        v-if="contribution.paymentSource?.method"
        class="mb-7 md:mb-9"
        :email="email"
        :payment-source="contribution.paymentSource"
        :stripe-public-key="content.stripePublicKey"
      />

      <CancelContribution :contribution="contribution" />
    </div>
    <div>
      <PaymentsHistory id="me" class="lg:ml-10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ContributionBox from '../../../components/pages/profile/contribution/ContributionBox.vue';
import CancelContribution from '../../../components/pages/profile/contribution/CancelContribution.vue';
import PaymentSource from '../../../components/pages/profile/contribution/PaymentSource.vue';
import PageTitle from '../../../components/PageTitle.vue';
import AppAlert from '../../../components/AppAlert.vue';
import PaymentsHistory from '../../../components/pages/profile/contribution/PaymentsHistory.vue';
import { currentUser } from '../../../store';
import UpdateContribution from '../../../components/pages/profile/contribution/UpdateContribution.vue';
import { ContributionInfo } from '../../../utils/api/api.interface';
import { fetchContribution } from '../../../utils/api/member';
import { MembershipStatus } from '../../../utils/enums/membership-status.enum';
import { ContributionType } from '../../../utils/enums/contribution-type.enum';
import { ContributionContent } from '../../../components/contribution/contribution.interface';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { PaymentMethod } from '../../../utils/enums/payment-method.enum';
import { fetchContent } from '../../../utils/api/content';

const { t } = useI18n();

const route = useRoute();
const updatedPaymentSource = route.query.updatedPaymentSource !== undefined;
const startedContribution = route.query.startedContribution !== undefined;

const content = ref<ContributionContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
  paymentMethods: [PaymentMethod.StripeCard],
  stripePublicKey: '',
  stripeCountry: 'eu',
});

const email = computed(() =>
  currentUser.value ? currentUser.value.email : ''
);

const isIniting = ref(true);
const contribution = ref<ContributionInfo>({
  type: ContributionType.None,
  membershipStatus: MembershipStatus.None,
});

onBeforeMount(async () => {
  isIniting.value = true;
  content.value = await fetchContent('join');
  contribution.value = await fetchContribution();
  isIniting.value = false;
});
</script>
