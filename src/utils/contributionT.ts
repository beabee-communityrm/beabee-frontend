import { useI18n } from 'vue-i18n';
import calcPaymentFee from './calcPaymentFee';
import { ContributionPeriod } from './enums/contribution-period.enum';
import { PaymentMethod } from './enums/payment-method.enum';

interface Contribution {
  amount: number;
  period: ContributionPeriod;
  payFee: boolean;
  paymentMethod: PaymentMethod;
}

export default function contributionT(
  key: string,
  contribution: Contribution
): string {
  const { t, n } = useI18n();

  const totalAmount =
    contribution.amount +
    (contribution.payFee ? calcPaymentFee(contribution).value : 0);

  return t(key, {
    amount: n(totalAmount, 'currency'),
    period:
      contribution.period === 'monthly' ? t('common.month') : t('common.year'),
  });
}
