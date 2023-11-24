import type { PaymentMethod } from '@beabee/beabee-common';

export interface GoCardlessDirectDebitPaymentSource {
  method: PaymentMethod.GoCardlessDirectDebit;
  bankName: string;
  accountHolderName: string;
  accountNumberEnding: string;
}
