import type { CalloutFormSchema } from '@beabee/beabee-common';

import type {
  CalloutData,
  CalloutResponseViewSchema,
  CalloutVariantData,
} from '@type';

export interface CreateCalloutData extends CalloutData {
  formSchema: CalloutFormSchema;
  variants: Record<string, CalloutVariantData>;
  responseViewSchema: CalloutResponseViewSchema | null;
}
