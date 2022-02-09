import { ref } from 'vue';
import { GeneralContent } from '../utils/api/api.interface';
import { fetchGeneralContent } from '../utils/api/content';

export const generalContent = ref<GeneralContent>({
  name: '',
  siteUrl: '',
  supportEmail: '',
  privacyLink: '',
  termsLink: '',
  currencyCode: '',
  footerLinks: [],
});

export const initGeneralContent = fetchGeneralContent().then((content) => {
  generalContent.value = content;
});
