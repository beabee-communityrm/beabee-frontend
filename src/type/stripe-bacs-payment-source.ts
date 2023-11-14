import type { PaymentMethod } from '@beabee/beabee-common';

export interface StripeBACSPaymentSource {
  method: PaymentMethod.StripeBACS;
  sortCode: string;
  last4: string;
}
