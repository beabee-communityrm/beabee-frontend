/* eslint-disable @typescript-eslint/no-var-requires */
const Color = require('color');
const theme = require('./theme.json');

const white = Color('white');
const black = Color('black');

function shades(_color, levels = []) {
  const color = Color(_color);
  return Object.assign(
    { DEFAULT: color.hex() },
    ...levels.map((level) => ({
      [level]:
        level > 100
          ? color.mix(black, level / 100 - 1).hex()
          : color.mix(white, 1 - level / 100).hex(),
    }))
  );
}

const fonts = theme.fonts || {};
const bodyFont = fonts.body || '"Open Sans", sans-serif';

const linkColor = theme.colors.link || theme.colors.primary;

module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    safelist: ['bg-success', 'bg-warning', 'bg-danger'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: shades(theme.colors.primary, [5, 10, 20, 40, 70, 80]),
      body: shades(theme.colors.body || theme.colors.primary, [40, 80]),
      link: shades(linkColor, [10, 70, 110]),
      warning: shades(theme.colors.warning || '#f5cc5b', [10, 30, 70]),
      success: shades(theme.colors.success || '#86a960', [10, 30, 70, 110]),
      danger: shades(theme.colors.danger || '#ce3d3d', [10, 30, 70, 110]),
      white: shades(theme.colors.white || '#ffffff'),
      black: shades(theme.colors.black || '#000000'),
      grey: {
        lighter: '#f6f6f6',
        light: '#c7c7c7',
        DEFAULT: '#a4a4a4',
        dark: '#5f5f5f',
        darker: '#434343',
      },
    },
    fontFamily: {
      body: bodyFont,
      title: fonts.title || bodyFont,
    },
    extend: {
      borderRadius: {
        DEFAULT: '3px',
      },
      lineHeight: {
        tight: '1.3',
        5.5: '1.375rem',
      },
      screens: {
        xs: '475px',
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
        input: '0 0 0 0.125em ' + Color(linkColor).alpha(0.25).rgb().string(),
      },
      fontSize: {
        '2.5xl': '1.75rem',
        '3.5xl': '2rem',
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover'],
    },
  },
  plugins: [],
};
