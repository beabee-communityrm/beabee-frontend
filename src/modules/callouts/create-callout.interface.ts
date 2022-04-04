import { Component } from 'vue';

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
  allowAnonymousResponses: boolean;
  showOnUserDashboards: boolean;
  usersCanEditAnswers: boolean;
}

export interface EndMessageStepProps {
  whenFinished: 'message' | 'redirect';
  thankYouTitle: string;
  thankYouText: string;
  URLRedirect: string;
}
export interface UrlAndSharingStepProps {
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

export interface MailchimpSyncStepProps {
  useMailchimpSync: boolean;
}

export interface DateAndDurationStepProps {
  hasEndDate: boolean;
  startNow: boolean;
  startDate: string;
  endDate: string;
}

export interface Step<T> {
  name: string;
  description: string;
  validated: boolean;
  component: Component;
  data: T;
}

export interface Steps {
  content: Step<ContentStepProps>;
  titleAndImage: Step<TitleAndImageStepProps>;
  visibility: Step<VisibilityStepProps>;
  endMessage: Step<EndMessageStepProps>;
  url: Step<UrlAndSharingStepProps>;
  mailchimp: Step<MailchimpSyncStepProps>;
  dates: Step<DateAndDurationStepProps>;
}
