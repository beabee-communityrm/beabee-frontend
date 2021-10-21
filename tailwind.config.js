/* eslint-disable @typescript-eslint/no-var-requires */
const Color = require('color');
const theme = require('./theme.json');

const white = Color('white');

function shades(_color, levels = []) {
  const color = Color(_color);
  return Object.assign(
    { DEFAULT: color.hex() },
    ...levels.map((level) => ({
      [level]: color.mix(white, 1 - level / 100).hex(),
    }))
  );
}

module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    // TODO: dynamic classes for `AppButton`. Check if this is there is
    // a better way to implement this
    safelist: [
      'bg-primary',
      'bg-link',
      'border-primary',
      'border-link',
      'text-primary',
      'text-link',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: shades(theme.colors.primary, [5, 10, 20, 40, 70, 80]),
      secondary: shades(theme.colors.secondary, [10, 30, 70]),
      text: shades(theme.colors.text || theme.colors.primary, [10, 70, 80]),
      link: shades(theme.colors.link || theme.colors.primary, [10, 70, 80]),
      warning: shades(theme.colors.warning || '#f5cc5b', [10, 30, 70]),
      success: shades(theme.colors.success || '#3a9283', [10, 30, 70]),
      danger: shades(theme.colors.danger || '#ce3d3d', [10, 30, 70]),
      white: shades(theme.colors.white || '#ffffff'),
      grey: {
        lighter: '#f6f6f6',
        light: '#c7c7c7',
        DEFAULT: '#a4a4a4',
        dark: '#5f5f5f',
        darker: '#434343',
      },
      info: {
        DEFAULT: '#4e85a8',
      },
    },
    fontFamily: {
      body: theme.fonts.body,
      title: theme.fonts.title || theme.fonts.body,
    },
    extend: {
      borderRadius: {
        DEFAULT: '3px',
      },
      lineHeight: {
        tight: '1.3',
      },
      screens: {
        xl: '1400px',
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
