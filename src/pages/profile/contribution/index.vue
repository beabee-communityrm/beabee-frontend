<route lang="yaml">
name: profileContribution
meta:
  pageTitle: menu.contribution
</route>

<template>
  <PageTitle :title="t('menu.contribution')" />

  <div v-if="!isIniting" class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <AppNotification
        v-if="updatedPaymentSource"
        class="mb-8"
        variant="success"
        :title="t('contribution.updatedPaymentSource')"
        removeable
        @remove="updatedPaymentSource = false"
      />
      <AppNotification
        v-if="startedContribution"
        class="mb-8"
        variant="success"
        :title="t('contribution.startedContribution')"
        removeable
        @remove="startedContribution = false"
      />
      <AppNotification
        v-if="cancelledContribution"
        class="mb-8"
        variant="error"
        :title="t('contribution.cancelledContribution')"
        removeable
        @remove="cancelledContribution = false"
      />

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

      <ContactCancelContribution
        id="me"
        :contribution="contribution"
        @cancel="$router.push('/profile/contribution/cancel')"
      />
    </div>
    <div>
      <ContactPaymentsHistory id="me" class="lg:ml-10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ContributionPeriod,
  ContributionType,
  MembershipStatus,
  PaymentMethod,
} from '@beabee/beabee-common';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import ContributionBox from '../../../components/pages/profile/contribution/ContributionBox.vue';
import ContactCancelContribution from '../../../components/contact/ContactCancelContribution.vue';
import PaymentSource from '../../../components/pages/profile/contribution/PaymentSource.vue';
import PageTitle from '../../../components/PageTitle.vue';
import ContactPaymentsHistory from '../../../components/contact/ContactPaymentsHistory.vue';
import { currentUser } from '../../../store';
import UpdateContribution from '../../../components/pages/profile/contribution/UpdateContribution.vue';
import { ContributionInfo } from '../../../utils/api/api.interface';
import { fetchContribution } from '../../../utils/api/contact';
import { ContributionContent } from '../../../components/contribution/contribution.interface';
import { fetchContent } from '../../../utils/api/content';
import AppNotification from '../../../components/AppNotification.vue';

const { t } = useI18n();
const route = useRoute();

const updatedPaymentSource = ref(
  route.query.updatedPaymentSource !== undefined
);
const startedContribution = ref(route.query.startedContribution !== undefined);
const cancelledContribution = ref(route.query.cancelled !== undefined);

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
