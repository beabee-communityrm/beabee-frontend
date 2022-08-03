import { reactive, computed } from 'vue';
import i18n from '../../../i18n';
import calcPaymentFee from '../../../utils/calcPaymentFee';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { PaymentMethod } from '../../../utils/enums/payment-method.enum';

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

const totalAmount = computed(
  () =>
    signUpData.amount +
    (signUpData.payFee ? calcPaymentFee(signUpData).value : 0)
);

const signUpDescription = computed(() => ({
  amount: n(totalAmount.value, 'currency'),
  period:
    signUpData.period === 'monthly' ? t('common.month') : t('common.year'),
}));

export function useJoin() {
  return { signUpDescription, signUpData };
}
