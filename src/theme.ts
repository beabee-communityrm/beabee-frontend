import { parseToRgba, mix, transparentize } from 'color2k';
import { watch } from 'vue';
import { generalContent } from './store';

export type Theme = {
  colors: {
    _name: string;
    primary: string;
    link: string;
    body: string;
    success: string;
    warning: string;
    danger: string;
    white: string;
    black: string;
  };
  fonts: {
    title: string;
    body: string;
  };
};

export type PartialTheme = { [T in keyof Theme]?: Partial<Theme[T]> };

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

export function getFullTheme(theme: PartialTheme): Theme {
  const primaryColor = theme.colors?.primary || '#262453';
  const bodyFont = theme.fonts?.body || '"Open Sans", sans-serif';

  return {
    colors: {
      _name: theme.colors?._name || 'custom',
      primary: primaryColor,
      body: theme.colors?.body || primaryColor,
      link: theme.colors?.link || primaryColor,
      warning: theme.colors?.warning || '#f5cc5b',
      success: theme.colors?.success || '#86a960',
      danger: theme.colors?.danger || '#ce3d3d',
      white: theme.colors?.white || '#ffffff',
      black: theme.colors?.black || '#000000',
    },
    fonts: {
      body: bodyFont,
      title: theme.fonts?.title || bodyFont,
    },
  };
}

watch(
  () => generalContent.value.theme,
  (newTheme) => {
    const { colors, fonts } = getFullTheme(newTheme);

    setShades('primary', colors.primary, [5, 10, 20, 40, 70, 80]);
    setShades('body', colors.body, [40, 80]);
    setShades('link', colors.link, [10, 70, 110]);
    setShades('warning', colors.warning || '#f5cc5b', [10, 30, 70]);
    setShades('success', colors.success || '#86a960', [10, 30, 70, 110]);
    setShades('danger', colors.danger || '#ce3d3d', [10, 30, 70, 110]);
    setShades('white', colors.white || '#ffffff');
    setShades('black', colors.black || '#000000');

    setCSSVar('--ff-body', fonts.body);
    setCSSVar('--ff-title', fonts.title);

    setCSSVar(
      '--bs-input',
      '0 0 0 0.125em ' + transparentize(colors.link, 0.75)
    );
  }
);
