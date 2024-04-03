import type { Address } from '.';

export interface CompleteSignupData {
  paymentFlowId: string;
  firstname?: string;
  lastname?: string;
  billingAddress?: Address;
  vatNumber?: string;
}
