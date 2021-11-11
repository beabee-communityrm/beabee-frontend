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
    safelist: ['bg-success', 'bg-warning', 'bg-danger'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: shades(theme.colors.primary, [5, 10, 20, 40, 70, 80]),
      secondary: shades(theme.colors.secondary, [10, 30, 70]),
      body: shades(theme.colors.body || theme.colors.primary, [10, 70, 80]),
      link: shades(theme.colors.link || theme.colors.primary, [10, 70, 80]),
      warning: shades(theme.colors.warning || '#f5cc5b', [10, 30, 70]),
      success: shades(theme.colors.success || '#86a960', [10, 30, 70]),
      danger: shades(theme.colors.danger || '#ce3d3d', [10, 30, 70]),
      white: shades(theme.colors.white || '#ffffff'),
      grey: {
        lighter: '#f6f6f6',
        light: '#c7c7c7',
        DEFAULT: '#a4a4a4',
        dark: '#5f5f5f',
        darker: '#434343',
      },
      black: {
        DEFAULT: '#000000',
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
      padding: {
        4.5: '1.125rem',
      },
      width: {
        76: '19rem',
      },
      height: {
        7.5: '1.875rem',
      },
      boxShadow: {
        DEFAULT: '0 0 8px 0 rgba(0, 0, 0, 0.2)',
      },
      fontSize: {
        '2.5xl': '1.75rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
