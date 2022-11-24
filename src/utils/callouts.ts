import { ItemStatus } from '@beabee/beabee-common';
import { format } from 'date-fns';
import { CalloutStepsProps } from '../components/pages/callouts/callouts.interface';
import { CreateCalloutData, GetCalloutDataWith } from './api/api.interface';

export function convertCalloutToSteps(
  callout?: GetCalloutDataWith<'form'>
): CalloutStepsProps {
  return {
    content: {
      introText: callout?.intro || '',
      formSchema: callout?.formSchema || { components: [] },
    },
    titleAndImage: {
      title: callout?.title || '',
      description: callout?.excerpt || '',
      coverImageURL: callout?.image || '',
      useCustomSlug: !!callout,
      autoSlug: '',
      slug: callout?.slug || '',
      overrideShare: !!callout?.shareTitle,
      shareTitle: callout?.shareTitle || '',
      shareDescription: callout?.shareDescription || '',
    },
    visibility: {
      whoCanTakePart:
        !callout || callout.access === 'member' ? 'members' : 'everyone',
      allowAnonymousResponses: callout?.access === 'anonymous',
      showOnUserDashboards: !callout?.hidden,
      usersCanEditAnswers: callout?.allowUpdate || false,
    },
    endMessage: {
      whenFinished: callout?.thanksRedirect ? 'redirect' : 'message',
      thankYouTitle: callout?.thanksTitle || '',
      thankYouText: callout?.thanksText || '',
      thankYouRedirect: callout?.thanksRedirect || '',
    },
    /*mailchimp: {
      useMailchimpSync: false,
    },*/
    dates: {
      startNow: !callout || callout.status === ItemStatus.Draft,
      hasEndDate: !!callout?.expires,
      startDate: callout?.starts ? format(callout.starts, 'yyyy-MM-dd') : '',
      startTime: callout?.starts ? format(callout.starts, 'HH:mm') : '',
      endDate: callout?.expires ? format(callout.expires, 'yyyy-MM-dd') : '',
      endTime: callout?.expires ? format(callout.expires, 'HH:mm') : '',
    },
  };
}

export function convertStepsToCallout(
  steps: CalloutStepsProps
): CreateCalloutData {
  return {
    slug: steps.titleAndImage.useCustomSlug
      ? steps.titleAndImage.slug
      : steps.titleAndImage.autoSlug,
    title: steps.titleAndImage.title,
    excerpt: steps.titleAndImage.description,
    image: steps.titleAndImage.coverImageURL,
    intro: steps.content.introText,
    formSchema: steps.content.formSchema,
    starts: steps.dates.startNow
      ? new Date()
      : new Date(steps.dates.startDate + 'T' + steps.dates.startTime),
    expires: steps.dates.hasEndDate
      ? new Date(steps.dates.endDate + 'T' + steps.dates.endTime)
      : null,
    allowUpdate: steps.visibility.usersCanEditAnswers,
    allowMultiple: false,
    hidden: !steps.visibility.showOnUserDashboards,
    access:
      steps.visibility.whoCanTakePart === 'members'
        ? 'member'
        : steps.visibility.allowAnonymousResponses
        ? 'anonymous'
        : 'guest',
    ...(steps.endMessage.whenFinished === 'message'
      ? {
          thanksText: steps.endMessage.thankYouText,
          thanksTitle: steps.endMessage.thankYouTitle,
          thanksRedirect: null,
        }
      : {
          thanksText: '',
          thanksTitle: '',
          thanksRedirect: steps.endMessage.thankYouRedirect,
        }),
    shareTitle: steps.titleAndImage.overrideShare
      ? steps.titleAndImage.shareTitle
      : '',
    shareDescription: steps.titleAndImage.overrideShare
      ? steps.titleAndImage.shareDescription
      : '',
  };
}
