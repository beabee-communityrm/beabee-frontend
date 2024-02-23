import { type CalloutFormSchema } from '@beabee/beabee-common';
import { computed, type Raw, type Component } from 'vue';
import i18n from '../../../../lib/i18n';
import { type AppStepperStep } from '../../../../type/app-stepper-step';

import type { CalloutMapSchema } from '@type';

const { t } = i18n.global;

export const buckets = computed(() => [
  { id: '', label: t('calloutResponseBuckets.inbox') },
  {
    id: 'verified',
    label: t('calloutResponseBuckets.verified'),
  },
  {
    id: 'trash',
    label: t('calloutResponseBuckets.trash'),
  },
]);

export interface ContentStepProps {
  formSchema: CalloutFormSchema;
}

export interface TitleAndImageStepProps {
  title: string;
  description: string;
  coverImageURL: string;
  introText: string;
  autoSlug: string;
  useCustomSlug: boolean;
  slug: string;
  overrideShare: boolean;
  shareTitle: string;
  shareDescription: string;
}

export interface SettingsStepProps {
  whoCanTakePart: 'members' | 'everyone';
  allowAnonymousResponses: 'none' | 'guests' | 'all';
  showOnUserDashboards: boolean;
  multipleResponses: boolean;
  usersCanEditAnswers: boolean;
  showResponses: boolean;
  responseViews: ('map' | 'gallery')[];
  responseBuckets: string[];
  responseTitleProp: string;
  responseImageProp: string;
  responseImageFilter: string;
  responseLinks: { text: string; url: string }[];
  mapSchema: CalloutMapSchema;
  locales: string[];
}

export interface EndMessageStepProps {
  whenFinished: 'message' | 'redirect';
  thankYouTitle: string;
  thankYouText: string;
  thankYouRedirect: string;
}
export interface MailchimpSyncStepProps {
  useMailchimpSync: boolean;
}

export interface DateAndDurationStepProps {
  hasEndDate: boolean;
  startNow: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface CalloutStepsProps {
  content: ContentStepProps;
  titleAndImage: TitleAndImageStepProps;
  settings: SettingsStepProps;
  endMessage: EndMessageStepProps;
  //mailchimp: MailchimpSyncStepProps;
  dates: DateAndDurationStepProps;
}

export interface CalloutStep<T> extends AppStepperStep {
  validated: boolean;
  error: boolean;
  data: T;
  component: Raw<Component>;
}

export type CalloutSteps = {
  [P in keyof CalloutStepsProps]: CalloutStep<CalloutStepsProps[P]>;
};
