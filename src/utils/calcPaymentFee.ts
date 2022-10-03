import { StripeFeeCountry } from './api/api.interface';
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
  ca: {
    [PaymentMethod.StripeCard]: (amount: number) => 0.3 + 0.029 * amount,
    [PaymentMethod.StripeSEPA]: () => 0, // Not available
    [PaymentMethod.StripeBACS]: () => 0, // Not available
  },
} as const;

const gcFee = (amount: number) => 0.2 + amount / 100;

function calcPaymentFee(feeable: Feeable, country: StripeFeeCountry): number {
  const feeFn =
    feeable.paymentMethod === PaymentMethod.GoCardlessDirectDebit
      ? gcFee
      : stripeFees[country][feeable.paymentMethod];

  return feeable.period === ContributionPeriod.Annually
    ? 0
    : feeFn(feeable.amount);
}

export default calcPaymentFee;
