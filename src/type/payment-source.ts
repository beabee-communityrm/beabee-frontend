import type {
  StripeCardPaymentSource,
  GoCardlessDirectDebitPaymentSource,
  StripeBACSPaymentSource,
  StripeSEPAPaymentSource,
  ManualPaymentSource,
} from '@type';

export type PaymentSource =
  | StripeCardPaymentSource
  | GoCardlessDirectDebitPaymentSource
  | StripeBACSPaymentSource
  | StripeSEPAPaymentSource
  | ManualPaymentSource;
