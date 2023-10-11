import {
  CalloutComponentSchema,
  CalloutSlideSchema,
  ItemStatus,
} from '@beabee/beabee-common';
import { format } from 'date-fns';
import { CalloutStepsProps } from '../components/pages/admin/callouts/callouts.interface';
import { FilterItem, FilterItems } from '../components/search/search.interface';
import { CreateCalloutData, GetCalloutDataWith } from './api/api.interface';
import env from '../env';

export function getSlideSchema(): CalloutSlideSchema {
  const id = 'slide' + Math.random().toString(36).substring(2, 8);
  return {
    id,
    title: 'New slide',
    components: [],
    navigation: {
      nextText: 'Next',
      prevText: 'Prev',
      nextSlideId: '',
      submitText: 'Submit',
    },
  };
}

export function convertCalloutToSteps(
  callout?: GetCalloutDataWith<'form' | 'responseViewSchema'>
): CalloutStepsProps {
  const settings = env.cnrMode
    ? ({
        whoCanTakePart: 'everyone',
        allowAnonymousResponses: 'guests',
        showOnUserDashboards: false,
        usersCanEditAnswers: false,
        multipleResponses: true,
      } as const)
    : ({
        whoCanTakePart:
          !callout || callout.access === 'member' ? 'members' : 'everyone',
        allowAnonymousResponses:
          callout?.access === 'anonymous'
            ? 'guests'
            : callout?.access === 'only-anonymous'
            ? 'all'
            : 'none',
        showOnUserDashboards: !callout?.hidden,
        usersCanEditAnswers: callout?.allowUpdate || false,
        multipleResponses: callout?.allowMultiple || false,
      } as const);

  return {
    content: {
      introText: callout?.intro || '',
      formSchema: callout?.formSchema || {
        slides: [getSlideSchema()],
      },
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
    settings: {
      ...settings,
      showResponses: !!callout?.responseViewSchema,
      responseViews: [
        ...(callout?.responseViewSchema?.gallery ? ['gallery' as const] : []),
        ...(callout?.responseViewSchema?.map ? ['map' as const] : []),
      ],
      responseBuckets: callout?.responseViewSchema?.buckets || [],
      responseTitleProp: callout?.responseViewSchema?.titleProp || '',
      responseImageProp: callout?.responseViewSchema?.imageProp || '',
      responseImageFilter: callout?.responseViewSchema?.imageFilter || '',
      responseLinks: callout?.responseViewSchema?.links || [],
      mapSchema: callout?.responseViewSchema?.map || {
        style: '',
        bounds: [
          [-180, -90],
          [180, 90],
        ],
        center: [0, 0],
        initialZoom: 3,
        maxZoom: 18,
        minZoom: 1,
        addressProp: '',
        addressPattern: '',
        addressPatternProp: '',
      },
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
    responseViewSchema: steps.settings.showResponses
      ? {
          buckets: steps.settings.responseBuckets,
          titleProp: steps.settings.responseTitleProp,
          imageProp: steps.settings.responseImageProp,
          imageFilter: steps.settings.responseImageFilter,
          gallery: steps.settings.responseViews.includes('gallery'),
          links: steps.settings.responseLinks,
          map: steps.settings.responseViews.includes('map')
            ? {
                ...steps.settings.mapSchema,
                addressPattern: steps.settings.mapSchema.addressPatternProp
                  ? steps.settings.mapSchema.addressPattern
                  : '',
              }
            : null,
        }
      : null,
    starts: steps.dates.startNow
      ? new Date()
      : new Date(steps.dates.startDate + 'T' + steps.dates.startTime),
    expires: steps.dates.hasEndDate
      ? new Date(steps.dates.endDate + 'T' + steps.dates.endTime)
      : null,
    allowMultiple: steps.settings.multipleResponses,
    allowUpdate:
      !steps.settings.multipleResponses && steps.settings.usersCanEditAnswers,
    hidden: !steps.settings.showOnUserDashboards,
    access:
      steps.settings.whoCanTakePart === 'members'
        ? 'member'
        : steps.settings.allowAnonymousResponses === 'none'
        ? 'guest'
        : steps.settings.allowAnonymousResponses === 'guests'
        ? 'anonymous'
        : 'only-anonymous',
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

function convertValuesToOptions(
  values: { value: string; label: string }[]
): { id: string; label: string }[] {
  return values.map(({ value, label }) => ({ id: value, label }));
}

function convertComponentToFilter(
  component: CalloutComponentSchema
): FilterItem {
  const baseItem = {
    label: component.label || component.key,
    nullable: true,
  };

  switch (component.type) {
    case 'checkbox':
      return { ...baseItem, type: 'boolean', nullable: false };

    case 'number':
      return { ...baseItem, type: 'number' };

    case 'select':
      return {
        ...baseItem,
        type: 'enum',
        options: convertValuesToOptions(component.data.values),
      };

    case 'selectboxes':
    case 'radio':
      return {
        ...baseItem,
        type: component.type === 'radio' ? 'enum' : 'array',
        options: convertValuesToOptions(component.values),
      };

    case 'textarea':
      return { ...baseItem, type: 'blob' };

    default:
      return { ...baseItem, type: 'text' };
  }
}

export function convertComponentsToFilters(
  components: CalloutComponentSchema[]
): FilterItems {
  const items = components.map((c) => {
    return [`answers.${c.key}`, convertComponentToFilter(c)] as const;
  });

  return Object.fromEntries(items);
}
