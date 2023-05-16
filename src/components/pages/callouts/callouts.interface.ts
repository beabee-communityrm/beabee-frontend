import { CalloutFormSchema } from '@beabee/beabee-common';

export interface ContentStepProps {
  introText: string;
  formSchema: CalloutFormSchema;
}

export interface TitleAndImageStepProps {
  title: string;
  description: string;
  coverImageURL: string;
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
