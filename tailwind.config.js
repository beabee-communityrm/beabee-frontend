function shades(color, levels = []) {
  return Object.assign(
    { DEFAULT: `var(--c-${color})` },
    ...levels.map((level) => ({
      [level]: `var(--c-${color}-${level})`,
    }))
  );
}

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: ['bg-success', 'bg-warning', 'bg-danger'],
  theme: {
    colors: {
      primary: shades('primary', [5, 10, 20, 40, 70, 80]),
      body: shades('body', [40, 80]),
      link: shades('link', [10, 70, 110]),
      warning: shades('warning', [10, 30, 70]),
      success: shades('success', [10, 30, 70, 110]),
      danger: shades('danger', [10, 30, 70, 110]),
      white: shades('white'),
      black: shades('black'),
      grey: {
        lighter: '#f6f6f6',
        light: '#c7c7c7',
        DEFAULT: '#a4a4a4',
        dark: '#5f5f5f',
        darker: '#434343',
      },
    },
    fontFamily: {
      body: 'var(--ff-body)',
      title: 'var(--ff-title)',
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
      padding: {
        4.5: '1.125rem',
      },
      spacing: {
        menu: '240px',
      },
      height: {
        7.5: '1.875rem',
      },
      boxShadow: {
        DEFAULT: '0 0 8px 0 rgba(0, 0, 0, 0.2)',
        input: 'var(--bs-input)',
      },
      fontSize: {
        '2.5xl': '1.75rem',
        '3.5xl': '2rem',
      },
    },
  },
  plugins: [],
};
