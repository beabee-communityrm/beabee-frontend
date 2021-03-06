import { ref } from 'vue';
import { GeneralContent } from '../utils/api/api.interface';
import { fetchContent } from '../utils/api/content';

export const generalContent = ref<GeneralContent>({
  organisationName: '',
  siteUrl: '',
  supportEmail: '',
  privacyLink: '',
  termsLink: '',
  currencyCode: '',
  footerLinks: [],
});

export const initGeneralContent = fetchContent('general').then((content) => {
  generalContent.value = content;
});
