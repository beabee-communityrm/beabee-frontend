import { Component } from 'vue';
import { Step } from '../../stepper/stepper.interface';

export interface ContentStepProps {
  introText: string;
  formSchema: { components: unknown[] };
}

export interface TitleAndImageStepProps {
  title: string;
  description: string;
  coverImageURL: string;
}

export interface VisibilityStepProps {
  whoCanTakePart: 'members' | 'everyone';
  allowAnonymousResponses: 'none' | 'guests' | 'all';
  showOnUserDashboards: boolean;
  usersCanEditAnswers: boolean;
}

export interface EndMessageStepProps {
  whenFinished: 'message' | 'redirect';
  thankYouTitle: string;
  thankYouText: string;
  thankYouRedirect: string;
}
export interface UrlAndSharingStepProps {
  autoSlug: string;
  useCustomSlug: boolean;
  slug: string;
  overrideShare: boolean;
  shareTitle: string;
  shareDescription: string;
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

export interface CalloutStep<T> extends Step {
  component: Component;
  data: T;
}

export interface CalloutSteps {
  content: CalloutStep<ContentStepProps>;
  titleAndImage: CalloutStep<TitleAndImageStepProps>;
  visibility: CalloutStep<VisibilityStepProps>;
  endMessage: CalloutStep<EndMessageStepProps>;
  url: CalloutStep<UrlAndSharingStepProps>;
  //mailchimp: Step<MailchimpSyncStepProps>;
  dates: CalloutStep<DateAndDurationStepProps>;
}
