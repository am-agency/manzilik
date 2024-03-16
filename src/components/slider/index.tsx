import React, { CSSProperties, ReactNode } from 'react';
import SlickSlider from 'react-slick';
import { Button } from 'antd';
import icons from '../../assets/icons';
import { getLayoutDirection } from '../../app/layouts';
import { useTranslation } from 'react-i18next';
import { SlidesResponsiveObject } from './types';
import { breakpoints, mapBreakpointsToResponsive } from './utils';
import { NextArrow } from './next_arrow';
import { EN } from '../../locales/constants';

interface Props {
  children: ReactNode;
  onClickItem?: () => void;
  onNextBtnClick?: () => void;
  wrapperClassName?: string;
  slidesToScroll: SlidesResponsiveObject;
  slidesToShow: SlidesResponsiveObject;
  variableWidth?: boolean;
  listLength?: number;
}

export interface ArrowsProps {
  className?: string;
  style?: CSSProperties;
  currentSlide?: number;
  slideCount?: number;
  onNextBtnClick?: () => void;
  slidesToScroll?: SlidesResponsiveObject;
  onClick?: () => void;
}

export const Slider = ({
  onNextBtnClick,
  children,
  wrapperClassName,
  slidesToScroll,
  slidesToShow,
  variableWidth,
  listLength,
}: Props) => {
  const { i18n } = useTranslation();

  const PrevArrow = ({ onClick }: ArrowsProps) => {
    return (
      <Button className={`prev-btn carousal-btns icon-wrapper ${getLayoutDirection(i18n.language)}`} onClick={onClick}>
        {<img src={i18n.language == EN ? icons.leftArrow.icon : icons.rightArrow.icon} />}
      </Button>
    );
  };

  return (
    <SlickSlider
      className={`products-carousel-wrapper ${wrapperClassName} ${getLayoutDirection(i18n.language)}`}
      dots={false}
      infinite={false}
      speed={800}
      variableWidth={variableWidth}
      slidesToShow={slidesToShow?.xl}
      slidesToScroll={slidesToScroll?.xl}
      nextArrow={<NextArrow slidesToScroll={slidesToScroll} onNextBtnClick={onNextBtnClick} />}
      prevArrow={<PrevArrow />}
      responsive={mapBreakpointsToResponsive(breakpoints, slidesToShow, slidesToScroll)}
    >
      {children}
    </SlickSlider>
  );
};
