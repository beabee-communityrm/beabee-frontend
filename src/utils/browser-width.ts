// TODO: Add window resize for development environment
// (for testing while changing the browesr width)
const width = window.innerWidth;

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1400,
  '2xl': 1536,
};

// TODO: Check if using a `device` object with isMobile, isTablet, isDesktopa properties would be a
// better solution
const browserWidth = {
  isSm: width < breakpoints.md,
  isMd: width >= breakpoints.md && width < breakpoints.lg,
  isLg: width >= breakpoints.lg && width < breakpoints.xl,
  isXl: width >= breakpoints.xl && width < breakpoints['2xl'],
  is2xl: width >= breakpoints['2xl'],
};

export { browserWidth };
