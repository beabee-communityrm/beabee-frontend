import { CalloutFormSchema } from '@beabee/beabee-common';
import { computed } from 'vue';
import i18n from '../../../../lib/i18n';
import { CalloutMapSchema } from '../../../../utils/api/api.interface';

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

export type CalloutSteps = {
  [P in keyof CalloutStepsProps]: {
    title: string;
    validated: boolean;
    error: boolean;
    data: CalloutStepsProps[P];
  };
};
