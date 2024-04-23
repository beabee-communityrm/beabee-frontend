import type { StripeFeeCountry } from '@beabee/beabee-common';

export interface ContentStripeData {
  publicKey: string;
  country: StripeFeeCountry;
  taxRateEnabled: boolean;
  taxRate: number;
}
