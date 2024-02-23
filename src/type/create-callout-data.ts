import type {
  CalloutData,
  CalloutFormData,
  CalloutResponseViewSchema,
} from '@type';
import type { CalloutVariantData } from './callout-variant-data';

export interface CreateCalloutData extends CalloutData, CalloutFormData {
  variants: Record<string, CalloutVariantData>;
  responseViewSchema?: CalloutResponseViewSchema | null;
}
