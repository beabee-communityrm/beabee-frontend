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

      <ContributionBox :contribution="contribution" class="mb-9" />

      <UpdateContribution :contribution="contribution" class="mb-7 md:mb-9" />

      <PaymentSource
        v-if="contribution.paymentSource"
        class="mb-7 md:mb-9"
        :email="email"
        :payment-source="contribution.paymentSource"
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
import ContributionBox from './components/ContributionBox.vue';
import CancelContribution from './components/CancelContribution.vue';
import PaymentSource from './components/PaymentSource.vue';
import PageTitle from '../../components/PageTitle.vue';
import AppAlert from '../../components/AppAlert.vue';
import PaymentsHistory from './components/PaymentsHistory.vue';
import { currentUser } from '../../store';
import UpdateContribution from './components/UpdateContribution.vue';
import { ContributionInfo } from '../../utils/api/api.interface';
import { fetchContribution } from '../../utils/api/member';
import { MembershipStatus } from '../../utils/enums/membership-status.enum';
import { ContributionType } from '../../utils/enums/contribution-type.enum';

const { t } = useI18n();

const route = useRoute();
const updatedPaymentSource = route.query.updatedPaymentSource !== undefined;
const startedContribution = route.query.startedContribution !== undefined;

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
  contribution.value = await fetchContribution();
  isIniting.value = false;
});
</script>
