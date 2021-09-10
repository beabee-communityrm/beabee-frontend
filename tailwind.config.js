module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
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
      },
      white: {
        DEFAULT: 'var(--white-color)',
      },
    },
    extend: {
      fontFamily: {
        body: 'var(--body-font)',
      },
      borderRadius: {
        DEFAULT: '3px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
