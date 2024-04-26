import type { StripeFeeCountry } from '@beabee/beabee-common';

export interface ContentPaymentData {
  stripePublicKey: string;
  stripeCountry: StripeFeeCountry;
  stripeTaxRateId: string;
  taxRateEnabled: boolean;
  taxRate: number;
}
