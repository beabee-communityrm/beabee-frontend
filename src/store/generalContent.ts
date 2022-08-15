import { ref } from 'vue';
import { mix, parseToRgba, transparentize } from 'color2k';
import { GeneralContent } from '../utils/api/api.interface';
import { fetchContent } from '../utils/api/content';

function setCSSVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

function setColorVar(name: string, color: string) {
  const [r, g, b] = parseToRgba(color);
  setCSSVar(name, `${r}, ${g}, ${b}`);
}

function setShades(
  colorName: string,
  colorValue: string,
  levels: number[] = []
) {
  setColorVar(`--c-${colorName}`, colorValue);
  for (const level of levels) {
    const levelColor =
      level > 100
        ? mix(colorValue, 'black', level / 100 - 1)
        : mix(colorValue, 'white', 1 - level / 100);
    setColorVar(`--c-${colorName}-${level}`, levelColor);
  }
}

export const generalContent = ref<GeneralContent>({
  organisationName: '',
  logoUrl: '',
  siteUrl: '',
  supportEmail: '',
  privacyLink: '',
  termsLink: '',
  locale: '',
  currencyCode: '',
  footerLinks: [],
  theme: {},
});

export const initGeneralContent = fetchContent('general').then((content) => {
  generalContent.value = content;

  // Load the theme
  const theme = generalContent.value.theme;
  const fonts = theme.fonts || {};

  const primaryColor = theme.colors?.primary || '#262453';
  const linkColor = theme.colors?.link || primaryColor;
  const bodyFont = fonts.body || '"Open Sans", sans-serif';

  setShades('primary', primaryColor, [5, 10, 20, 40, 70, 80]);
  setShades('body', theme.colors?.body || primaryColor, [40, 80]);
  setShades('link', linkColor, [10, 70, 110]);
  setShades('warning', theme.colors?.warning || '#f5cc5b', [10, 30, 70]);
  setShades('success', theme.colors?.success || '#86a960', [10, 30, 70, 110]);
  setShades('danger', theme.colors?.danger || '#ce3d3d', [10, 30, 70, 110]);
  setShades('white', theme.colors?.white || '#ffffff');
  setShades('black', theme.colors?.black || '#000000');

  setCSSVar('--ff-body', bodyFont);
  setCSSVar('--ff-title', fonts.title || bodyFont);

  setCSSVar('--bs-input', '0 0 0 0.125em ' + transparentize(linkColor, 0.75));
});
