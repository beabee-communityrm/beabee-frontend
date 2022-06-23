<template>
  <AuthBox>
    <form @submit.prevent="submitSignUp">
      <JoinHeader
        class="mb-3"
        :title="joinContent.title"
        :description="joinContent.subtitle"
      />

      <AppSubHeading v-if="joinContent.showNoContribution" class="mb-1">
        {{ t('join.contribution') }}
      </AppSubHeading>

      <div v-if="joinContent.showNoContribution" class="mb-4">
        <label>
          <input v-model="signUpData.noContribution" type="checkbox" />
          {{ t('join.noContribution') }}
        </label>
      </div>

      <Contribution
        v-if="!generalContent.hideContribution && !signUpData.noContribution"
        v-model:amount="signUpData.amount"
        v-model:period="signUpData.period"
        v-model:payFee="signUpData.payFee"
        :fee="signUpData.fee"
        :content="joinContent"
      >
        <AccountSection
          v-model:email="signUpData.email"
          v-model:password="signUpData.password"
        />
      </Contribution>

      <!-- TODO: clean this up by always having account section above contribution -->
      <AccountSection
        v-else
        v-model:email="signUpData.email"
        v-model:password="signUpData.password"
      />

      <MessageBox v-if="validation.$errors.length > 0" class="mb-4" />

      <AppButton
        :disabled="validation.$invalid"
        :loading="loading"
        variant="link"
        type="submit"
        class="mb-4 w-full"
        >{{ buttonText }}</AppButton
      >

      <JoinFooter :privacy-link="generalContent.privacyLink" />
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import JoinHeader from './components/JoinHeader.vue';
import AuthBox from '../AuthBox.vue';
import AccountSection from './components/AccountSection.vue';
import JoinFooter from './components/JoinFooter.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import Contribution from '../../../components/contribution/Contribution.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { generalContent } from '../../../store';
import { JoinContent } from '../../../utils/api/api.interface';
import { fetchContent } from '../../../utils/api/content';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { signUp } from '../../../utils/api/signup';
import useVuelidate from '@vuelidate/core';
import AppSubHeading from '../../../components/AppSubHeading.vue';

const { t, n } = useI18n();

const route = useRoute();
const router = useRouter();

const joinContent = ref<JoinContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
  showNoContribution: false,
  subtitle: '',
  title: '',
});

const signUpData = reactive({
  email: '',
  password: '',
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  noContribution: false,
  prorate: false,

  get totalAmount(): number {
    return this.payFee && this.period === ContributionPeriod.Monthly
      ? this.amount + this.fee
      : this.amount;
  },
  get fee(): number {
    return (this.amount + 20) / 100;
  },
});

const loading = ref(false);

const buttonText = computed(() =>
  signUpData.noContribution
    ? t('join.now')
    : t('join.contribute', {
        amount: n(signUpData.totalAmount, 'currency'),
        period:
          signUpData.period === 'monthly'
            ? t('common.month')
            : t('common.year'),
      })
);

const validation = useVuelidate();

async function submitSignUp() {
  loading.value = true;
  try {
    const data = await signUp(signUpData);
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      router.push({ path: '/join/confirm-email' });
    }
  } catch (err) {
    // Only revert loading on error as success causes route change
    loading.value = false;
    throw err;
  }
}

onBeforeMount(async () => {
  joinContent.value = await fetchContent('join');
  signUpData.amount = route.query.amount
    ? Number(route.query.amount)
    : joinContent.value.initialAmount;

  const period = route.query.period as ContributionPeriod;
  signUpData.period = Object.values(ContributionPeriod).includes(period)
    ? period
    : joinContent.value.initialPeriod;

  if (!joinContent.value.showAbsorbFee) {
    signUpData.payFee = false;
  }

  if (generalContent.value.hideContribution) {
    signUpData.noContribution = true;
  }
});
</script>
