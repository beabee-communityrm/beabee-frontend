module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: {
        DEFAULT: 'var(--black-color)',
      },
      primary: {
        DEFAULT: 'var(--primary-color)',
        5: 'var(--primary-5-color)',
        10: 'var(--primary-10-color)',
        20: 'var(--primary-20-color)',
        40: 'var(--primary-40-color)',
        70: 'var(--primary-70-color)',
        80: 'var(--primary-80-color)',
      },
      grey: {
        lighter: 'var(--grey-lighter-color)',
        light: 'var(--grey-light-color)',
        DEFAULT: 'var(--grey-color)',
        dark: 'var(--grey-dark-color)',
        darker: 'var(--grey-darker-color)',
      },
      link: {
        light: 'var(--link-light-color)',
        DEFAULT: 'var(--link-color)',
      },
      info: {
        DEFAULT: 'var(--info-color)',
      },
      warning: {
        DEFAULT: 'var(--warning-color)',
      },
      success: {
        DEFAULT: 'var(--success-color)',
      },
      danger: {
        DEFAULT: 'var(--danger-color)',
        10: 'var(--danger-10-color)',
        30: 'var(--danger-30-color)',
        70: 'var(--danger-70-color)',
      },
      white: {
        DEFAULT: 'var(--white-color)',
      },
      boxShadow: {
        DEFAULT: '0 0 8px 0 rgba(0, 0, 0, 0.2)',
      },
    },
    extend: {
      fontFamily: {
        body: 'var(--body-font)',
      },
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
