import { computed, ComputedRef } from 'vue';
import { ContributionPeriod } from './enums/contribution-period.enum';
import { PaymentMethod } from './enums/payment-method.enum';

interface Feeable {
  amount: number;
  period: ContributionPeriod;
  paymentMethod: PaymentMethod;
}

const stripeFees = {
  gb: {
    [PaymentMethod.StripeCard]: (amount: number) => 0.2 + 0.014 * amount,
    [PaymentMethod.StripeSEPA]: () => 0.3,
    [PaymentMethod.StripeBACS]: (amount: number) => 0.2 * 0.01 * amount,
  },
  eu: {
    [PaymentMethod.StripeCard]: (amount: number) => 0.25 + 0.014 * amount,
    [PaymentMethod.StripeSEPA]: () => 0.35,
    [PaymentMethod.StripeBACS]: () => 0, // Not available
  },
} as const;

const fees = {
  [PaymentMethod.GoCardlessDirectDebit]: (amount: number) => 0.2 + amount / 100,
  ...stripeFees[import.meta.env.VITE_STRIPE_COUNTRY],
} as const;

function calcPaymentFee(feeable: Feeable): ComputedRef<number> {
  return computed(() =>
    feeable.period === ContributionPeriod.Annually
      ? 0
      : fees[feeable.paymentMethod](feeable.amount)
  );
}

export default calcPaymentFee;
