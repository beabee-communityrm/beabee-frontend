<template>
  <AuthBox>
    <form @submit.prevent="emit('submit', signUpData)">
      <JoinHeader
        class="mb-3"
        :title="joinContent.title"
        :description="joinContent.subtitle"
      />

      <AppSubHeading v-if="joinContent.showNoContribution" class="mb-1">
        {{ t('join.contribution') }}
      </AppSubHeading>

      <AppCheckbox
        v-if="joinContent.showNoContribution"
        v-model="signUpData.noContribution"
        :label="t('join.noContribution')"
        class="mb-4"
      />

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

      <p class="text-center text-xs">
        {{ t('join.notice') }}
        <a
          class="text-link hover:text-primary underline"
          :href="generalContent.privacyLink"
          target="_blank"
          rel="noreferrer"
          >{{ t('join.privacy') }}</a
        >.
      </p>
    </form>
  </AuthBox>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import JoinHeader from './JoinHeader.vue';
import { JoinContent } from '../../../../utils/api/api.interface';
import { generalContent } from '../../../../store';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import AccountSection from './AccountSection.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import Contribution from '../../../../components/contribution/Contribution.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import AuthBox from '../../AuthBox.vue';
import AppSubHeading from '../../../../components/AppSubHeading.vue';

const emit = defineEmits(['submit']);
const props = defineProps<{
  joinContent: JoinContent;
  loading?: boolean;
}>();

const { n, t } = useI18n();
const route = useRoute();
const validation = useVuelidate();

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

onBeforeMount(() => {
  signUpData.amount = route.query.amount
    ? Number(route.query.amount)
    : props.joinContent.initialAmount;

  const period = route.query.period as ContributionPeriod;
  signUpData.period = Object.values(ContributionPeriod).includes(period)
    ? period
    : props.joinContent.initialPeriod;

  if (!props.joinContent.showAbsorbFee) {
    signUpData.payFee = false;
  }

  if (generalContent.value.hideContribution) {
    signUpData.noContribution = true;
  }
});
</script>
