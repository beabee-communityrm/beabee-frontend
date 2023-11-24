import type { CalloutFormSchema } from '@beabee/beabee-common';

export interface CalloutFormData {
  formSchema: CalloutFormSchema;
  intro: string;
  thanksText: string;
  thanksTitle: string;
  thanksRedirect?: string;
  shareTitle?: string;
  shareDescription?: string;
}
