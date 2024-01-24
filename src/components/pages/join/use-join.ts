import {
  calcPaymentFee,
  ContributionPeriod,
  PaymentMethod,
} from '@beabee/beabee-common';
import { reactive, computed, type Ref } from 'vue';

import i18n from '@lib/i18n';

import type { ContentJoin } from '@type';

const { n, t } = i18n.global;

const signUpData = reactive({
  email: '',
  password: '',
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  noContribution: false,
  prorate: false,
  paymentMethod: PaymentMethod.StripeCard,
});

export function useJoin(content: Ref<ContentJoin>) {
  const signUpDescription = computed(() => {
    const totalAmount =
      signUpData.amount +
      (signUpData.payFee
        ? calcPaymentFee(signUpData, content.value.stripeCountry)
        : 0);

    return {
      amount: n(totalAmount, 'currency'),
      period:
        signUpData.period === 'monthly' ? t('common.month') : t('common.year'),
    };
  });

  return { signUpDescription, signUpData };
}
