module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      primary: {
        light: 'var(--primary-light-color)',
        DEFAULT: 'var(--primary-color)',
        dark: 'var(--primary-dark-color)',
      },
      success: {
        light: 'var(--success-light-color)',
        DEFAULT: 'var(--success-color)',
        dark: 'var(--success-dark-color)',
      },
      danger: {
        light: 'var(--danger-light-color)',
        DEFAULT: 'var(--danger-color)',
        dark: 'var(--danger-dark-color)',
      },
    },
    textColor: {
      dark: {
        100: 'var(--secondary-dark-text-color)',
        DEFAULT: 'var(--primary-dark-text-color)',
      },
      white: {
        DEFAULT: 'var(--primary-white-text-color)',
      },
    },
    extend: {
      fontFamily: {
        body: 'var(--body-font)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
