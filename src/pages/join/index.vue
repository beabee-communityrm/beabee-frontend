<route lang="yaml">
name: join
meta:
  layout: Auth
  noAuth: true
  pageTitle: pageTitle.join
</route>
<template>
  <AuthBox>
    <JoinForm
      v-if="!stripePaymentLoaded"
      :join-content="joinContent"
      :loading="loading"
      @submit.prevent="submitSignUp"
    />

    <div v-if="stripeClientSecret" v-show="stripePaymentLoaded">
      <JoinHeader :title="joinContent.title" />

      <AppAlert variant="info" class="mb-4">
        <template #icon>
          <font-awesome-icon :icon="['fa', 'hand-sparkles']" />
        </template>
        {{ t('joinPayment.willBeContributing', signUpDescription) }}
      </AppAlert>

      <p class="mb-3 text-xs font-semibold text-body-80">
        {{ t('joinPayment.note') }}
      </p>
      <p class="mb-6 text-xs font-semibold text-body-80">
        <i18n-t keypath="joinPayment.goBack">
          <template #back>
            <a
              class="cursor-pointer text-link underline"
              @click="
                stripeClientSecret = '';
                stripePaymentLoaded = false;
              "
            >
              {{ t('joinPayment.goBackButton') }}
            </a>
          </template>
        </i18n-t>
      </p>
      <StripePayment
        :client-secret="stripeClientSecret"
        :public-key="joinContent.stripePublicKey"
        :email="signUpData.email"
        :return-url="completeUrl"
        show-name-fields
        @loaded="
          stripePaymentLoaded = true;
          loading = false;
        "
      />
    </div>
  </AuthBox>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import JoinHeader from '../../components/pages/join/JoinHeader.vue';
import AuthBox from '../../components/AuthBox.vue';
import { generalContent } from '../../store';
import StripePayment from '../../components/StripePayment.vue';
import { fetchContent } from '../../utils/api/content';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { signUp, completeUrl } from '../../utils/api/signup';
import AppAlert from '../../components/AppAlert.vue';
import { useJoin } from '../../components/pages/join/use-join';
import JoinForm from '../../components/pages/join/JoinForm.vue';
import { JoinContent } from '../../utils/api/api.interface';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const stripePaymentLoaded = ref(false);
const stripeClientSecret = ref('');

const joinContent = ref<JoinContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
  showNoContribution: false,
  subtitle: '',
  title: '',
  paymentMethods: [],
  stripePublicKey: '',
  stripeCountry: 'eu',
});

const { signUpData, signUpDescription } = useJoin(joinContent);

async function submitSignUp() {
  loading.value = true;
  try {
    const data = await signUp(signUpData);
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else if (data.clientSecret) {
      stripeClientSecret.value = data.clientSecret;
    } else {
      router.push({ path: '/join/confirm-email' });
    }
  } catch (err) {
    loading.value = false;
    throw err;
  }
}

onBeforeMount(async () => {
  loading.value = false;
  stripePaymentLoaded.value = false;
  stripeClientSecret.value = '';

  joinContent.value = await fetchContent('join');

  signUpData.amount = route.query.amount
    ? Number(route.query.amount)
    : joinContent.value.initialAmount;

  const period = route.query.period as ContributionPeriod;
  signUpData.period = Object.values(ContributionPeriod).includes(period)
    ? period
    : joinContent.value.initialPeriod;

  signUpData.paymentMethod = joinContent.value.paymentMethods[0];

  if (!joinContent.value.showAbsorbFee) {
    signUpData.payFee = false;
  }

  if (generalContent.value.hideContribution) {
    signUpData.noContribution = true;
  }
});
</script>
