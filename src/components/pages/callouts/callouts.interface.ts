import { CalloutFormSchema } from '../../../utils/api/api.interface';

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

export interface VisibilityStepProps {
  whoCanTakePart: 'members' | 'everyone';
  allowAnonymousResponses: boolean;
  showOnUserDashboards: boolean;
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
  visibility: VisibilityStepProps;
  endMessage: EndMessageStepProps;
  //mailchimp: MailchimpSyncStepProps;
  dates: DateAndDurationStepProps;
}
