import { CalloutResponseAnswers } from '@beabee/beabee-common';

export interface FormChangeEvent {
  isValid: boolean;
  data: CalloutResponseAnswers[string];
}
