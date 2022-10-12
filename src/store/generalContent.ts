import { ref } from 'vue';
import { GeneralContent } from '../utils/api/api.interface';
import { fetchContent } from '../utils/api/content';

export const generalContent = ref<GeneralContent>({
  organisationName: '',
  logoUrl: '',
  siteUrl: '',
  supportEmail: '',
  privacyLink: '',
  termsLink: '',
  locale: '',
  currencyCode: '',
  currencySymbol: '',
  footerLinks: [],
  theme: {},
});

export const initGeneralContent = fetchContent('general').then((content) => {
  generalContent.value = content;
  return content;
});
