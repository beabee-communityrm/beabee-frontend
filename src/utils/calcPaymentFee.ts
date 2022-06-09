import { computed, ComputedRef } from 'vue';
import { ContributionPeriod } from './enums/contribution-period.enum';
import { PaymentMethod } from './enums/payment-method.enum';

interface Feeable {
  amount: number;
  period: ContributionPeriod;
  paymentMethod: PaymentMethod;
}

const country = import.meta.env.VITE_STRIPE_COUNTRY;

const fees: Record<
  typeof country,
  Record<PaymentMethod, (a: number) => number>
> = {
  gb: {
    [PaymentMethod.StripeCard]: (amount) => 0.2 + 0.014 * amount,
    [PaymentMethod.StripeSEPA]: () => 0.3,
    [PaymentMethod.GoCardlessDirectDebit]: (amount) => 0.2 + amount / 100,
  },
  eu: {
    [PaymentMethod.StripeCard]: (amount) => 0.25 + 0.014 * amount,
    [PaymentMethod.StripeSEPA]: () => 0.35,
    [PaymentMethod.GoCardlessDirectDebit]: (amount) => 0.2 + amount / 100,
  },
} as const;

function calcPaymentFee(feeable: Feeable): ComputedRef<number> {
  return computed(() =>
    feeable.period === ContributionPeriod.Annually
      ? 0
      : fees[country][feeable.paymentMethod](feeable.amount)
  );
}

export default calcPaymentFee;
