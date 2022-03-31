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
  meta_title: string;
  meta_description: string;
}

export interface MailchimpSyncStepProps {
  useMailchimpSync: boolean;
}

export interface DateAndDurationStepProps {
  calloutHasEndDate: boolean;
  callout_start_date: string;
  callout_end_date: string;
}

export interface Step<T> {
  id: string;
  name: string;
  description: string;
  validated: boolean;
  component: Component;
  data: T;
}

export type Steps = [
  Step<ContentStepProps>,
  Step<TitleAndImageStepProps>,
  Step<VisibilityStepProps>,
  Step<EndMessageStepProps>,
  Step<UrlAndSharingStepProps>,
  Step<MailchimpSyncStepProps>,
  Step<DateAndDurationStepProps>
];
