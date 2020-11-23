/**
 * breakpoint.
 */
const breakpoint = () => {
  if (window.innerWidth <= 375) {
    return 'mobile';
  }

  // ADD YOUR BREAKPOINTS HERE

  // ADD YOUR BREAKPOINTS HERE

  if (window.innerWidth <= 1280) {
    return 'desktop';
  }

  return 'desktop';
};

export default breakpoint;
