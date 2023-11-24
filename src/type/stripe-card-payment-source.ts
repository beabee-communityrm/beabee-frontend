import type { PaymentMethod } from '@beabee/beabee-common';

export interface StripeCardPaymentSource {
  method: PaymentMethod.StripeCard;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}
