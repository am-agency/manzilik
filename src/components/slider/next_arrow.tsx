import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../app/layouts';
import icons from '../../assets/icons';
import { breakpointType } from './types';
import { addResizeListener, breakpoints, getElementWidthAndChildrenWidth, removeResizeListener } from './utils';
import { ArrowsProps } from '.';
import { EN } from '../../locales/constants';

export const NextArrow = ({ onClick, currentSlide = 0, onNextBtnClick, slidesToScroll, slideCount }: ArrowsProps) => {
  const { i18n } = useTranslation();
  const [isContendOverflowed, setIsContentOverflowed] = useState<boolean>();

  const checkIfContentIsLargerThanContainer = () => {
    const { childrenWidth } = getElementWidthAndChildrenWidth('slick-track');
    const slickTrack = getElementWidthAndChildrenWidth('slick-list');
    const contentIsLargerThanWindow = childrenWidth >= slickTrack.innerWidth;
    setIsContentOverflowed(contentIsLargerThanWindow);
  };

  const checkIfIsLastSlide = () => {
    const breakpointValue =
      Object.keys(breakpoints).find((key) => {
        const breakPointKey = key as breakpointType;
        return breakpoints[breakPointKey] >= window.innerWidth;
      }) || 'xl';

    const breakpoint = breakpointValue as breakpointType;
    const lastSlideIndex = currentSlide + (slidesToScroll || {})[breakpoint]!;

    return lastSlideIndex >= slideCount!;
  };

  useEffect(() => {
    checkIfContentIsLargerThanContainer();
    addResizeListener(checkIfContentIsLargerThanContainer);
    return removeResizeListener();
  }, []);

  return (
    <Button
      className={`next-btn carousal-btns icon-wrapper ${getLayoutDirection(i18n.language)}`}
      onClick={() => {
        onNextBtnClick?.();
        onClick?.();
      }}
    >
      {<img src={i18n.language == EN ? icons.rightArrow.icon : icons.leftArrow.icon} />}
    </Button>
  );
};
