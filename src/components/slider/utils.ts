import { SlidesResponsiveObject } from './types';

export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1024,
};

export const mapBreakpointsToResponsive = (
  breakpoints: SlidesResponsiveObject,
  slidesToShow: SlidesResponsiveObject,
  slidesToScroll: SlidesResponsiveObject
) => [
  {
    breakpoint: breakpoints.xl,
    settings: {
      slidesToShow: slidesToShow?.xl,
      slidesToScroll: slidesToScroll?.xl,
    },
  },
  {
    breakpoint: breakpoints.lg,
    settings: {
      slidesToShow: slidesToShow?.lg,
      slidesToScroll: slidesToScroll?.lg,
    },
  },
  {
    breakpoint: breakpoints.md,
    settings: {
      slidesToShow: slidesToShow?.md,
      slidesToScroll: slidesToScroll?.md,
    },
  },
  {
    breakpoint: breakpoints.sm,
    settings: {
      slidesToShow: slidesToShow?.sm,
      slidesToScroll: slidesToScroll?.sm,
    },
  },
];

export const getElementWidthAndChildrenWidth = (classname: string) => {
  const element = document.getElementsByClassName(classname)[0];
  let totalWidth = 0;

  if (element) {
    for (let i = 0; i < element.children.length; i++) {
      totalWidth += element.children[i].clientWidth;
    }
  }
  return { innerWidth: element?.clientWidth, childrenWidth: totalWidth };
};

export const addResizeListener = (cbFunction: () => void) => {
  window.addEventListener('resize', cbFunction);
};

export const removeResizeListener = () => {
  window.removeEventListener('resize', () => {
    console.debug('resize-listener-removed');
  });
};
