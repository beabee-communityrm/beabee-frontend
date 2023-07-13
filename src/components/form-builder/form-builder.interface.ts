import {
  CalloutFormSchema,
  CalloutPageSchema,
  CalloutResponseAnswers,
} from '@beabee/beabee-common';

export const formOpts = {
  builder: {
    basic: false,
    advanced: false,
    data: false,
    resource: false,
    premium: false,
    layout: false,
    custom: {
      title: 'Basic',
      default: true,
      components: {
        textfield: {
          title: 'Text Field',
          icon: 'terminal',
          schema: {
            type: 'textfield',
          },
        },
        textarea: {
          title: 'Text Area',
          icon: 'font',
          schema: {
            type: 'textarea',
          },
        },
        number: {
          title: 'Number',
          icon: 'hashtag',
          schema: {
            type: 'number',
          },
        },
        email: {
          title: 'Email',
          icon: 'at',
          schema: {
            type: 'email',
          },
        },
        url: {
          title: 'Url',
          icon: 'link',
          schema: {
            type: 'url',
          },
        },
        checkbox: {
          title: 'Checkbox',
          icon: 'check-square',
          schema: {
            type: 'checkbox',
          },
        },
        select: {
          title: 'Dropdown',
          icon: 'th-list',
          schema: {
            type: 'select',
          },
        },
        selectboxes: {
          title: 'Select Boxes',
          group: 'basic',
          icon: 'plus-square',
          schema: {
            type: 'selectboxes',
          },
        },
        radio: {
          title: 'Radio',
          icon: 'dot-circle-o',
          schema: {
            type: 'radio',
          },
        },
      },
    },
    custom2: {
      title: 'Advanced',
      components: {
        decision: {
          title: 'Decision',
          icon: 'code-branch',
          schema: {
            type: 'decision',
          },
        },
        address: {
          title: 'Address',
          icon: 'home',
          schema: {
            type: 'address',
          },
        },
        phoneNumber: {
          title: 'Phone Number',
          icon: 'phone-square',
          schema: {
            type: 'phoneNumber',
          },
        },
        currency: {
          title: 'Currency',
          icon: 'usd',
          schema: {
            type: 'currency',
          },
        },
        datetime: {
          title: 'Date / Time',
          icon: 'calendar',
          schema: {
            type: 'datetime',
          },
        },
        time: {
          title: 'Time',
          icon: 'clock-o',
          schema: {
            type: 'time',
          },
        },
        signature: {
          title: 'Signature',
          icon: 'pencil',
          schema: {
            type: 'signature',
          },
        },
        content: {
          title: 'Content',
          icon: 'html5',
          schema: {
            type: 'content',
          },
        },
      },
    },
  },
};

export interface FormBuilderRef {
  builder: {
    form: CalloutFormSchema;
    instance: {
      addPage(page: { schema: CalloutPageSchema }): void;
      removePage(page: number): void;
      setPage(page: number): void;
    };
  };
}

export interface FormSubmission {
  data: CalloutResponseAnswers;
}

export interface FormRef {
  formio: {
    getPageIndexByKey(key: string): number;
    setPage(n: number): Promise<void>;
    nextPage(): Promise<void>;
    prevPage(): Promise<void>;
    checkValidity(
      data: CalloutResponseAnswers,
      dirty: boolean,
      row: CalloutResponseAnswers,
      currentPageOnly: boolean
    ): boolean;
    submit(): Promise<FormSubmission>;

    components: CalloutPageSchema[];
    currentPage: CalloutPageSchema;
    localData: CalloutResponseAnswers;
  };
}

import './components/Decision';
