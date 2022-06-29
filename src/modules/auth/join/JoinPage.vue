<template>
  <JoinForm
    v-if="!stripePaymentLoaded"
    :join-content="joinContent"
    :loading="loading"
    @submit.prevent="submitSignUp"
  />

  <div
    v-if="stripeClientSecret && localSignUpData"
    v-show="stripePaymentLoaded"
  >
    <AppAlert variant="info" class="mb-4">
      <template #icon>
        <font-awesome-icon :icon="['fa', 'hand-sparkles']" />
      </template>
      {{ contributionT('joinPayment.willBeContributing', localSignUpData) }}
    </AppAlert>
    <p class="mb-3">
      {{ t('joinPayment.note') }}
    </p>
    <p class="mb-6">
      <i18n-t keypath="joinPayment.goBack">
        <template #back>
          <a class="cursor-pointer underline text-link" @click="reset">
            {{ t('joinPayment.goBackButton') }}
          </a>
        </template>
      </i18n-t>
    </p>
    <StripePayment
      :client-secret="stripeClientSecret"
      :email="localSignUpData.email"
      :return-url="completeUrl"
      @loaded="handleStripePaymentLoaded"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { JoinContent, SignupData } from '../../../utils/api/api.interface';
import { fetchContent } from '../../../utils/api/content';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { completeUrl, signUp } from '../../../utils/api/signup';
import JoinForm from './components/JoinForm.vue';
import { useI18n } from 'vue-i18n';
import contributionT from '../../../utils/contributionT';
import StripePayment from '../../../components/StripePayment.vue';
import AppAlert from '../../../components/AppAlert.vue';

const router = useRouter();
const { t } = useI18n();

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
});

const loading = ref(false);
const localSignUpData = ref<SignupData>();
const stripeClientSecret = ref('');
const stripePaymentLoaded = ref(false);

function reset() {
  loading.value = false;
  stripeClientSecret.value = '';
  stripePaymentLoaded.value = false;
}

function handleStripePaymentLoaded() {
  stripePaymentLoaded.value = true;
  loading.value = false;
}

async function submitSignUp(signUpData: SignupData) {
  loading.value = true;
  localSignUpData.value = signUpData;

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
  reset();
  joinContent.value = await fetchContent('join');
});
</script>
