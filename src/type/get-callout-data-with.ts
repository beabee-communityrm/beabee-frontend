import type {
  GetCalloutWith,
  GetCalloutData,
  Noop,
  CalloutResponseViewSchema,
  CalloutFormData,
} from '@type';
import type { CalloutVariantData } from './callout-variant-data';

export type GetCalloutDataWith<With extends GetCalloutWith> = GetCalloutData &
  ('form' extends With ? CalloutFormData : Noop) &
  ('hasAnswered' extends With ? { hasAnswered: boolean } : Noop) &
  ('responseCount' extends With ? { responseCount: number } : Noop) &
  ('responseViewSchema' extends With
    ? { responseViewSchema: CalloutResponseViewSchema | null }
    : Noop) &
  ('variants' extends With
    ? { variants: Record<string, CalloutVariantData> }
    : Noop);
