import type { CalloutFormSchema } from '@beabee/beabee-common';

export interface GetCalloutFormData {
  formSchema: CalloutFormSchema;
  intro: string;
  thanksText: string;
  thanksTitle: string;
  thanksRedirect?: string;
  shareTitle?: string;
  shareDescription?: string;
}
