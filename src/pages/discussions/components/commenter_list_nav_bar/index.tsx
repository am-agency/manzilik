import React, { FunctionComponent, useEffect, useState } from 'react';
// hooks
import { useTranslation } from 'react-i18next';
// strings
import { PREV, NEXT } from '../../../../locales/strings';
// components
import icons from '../../../../assets/icons';
import { Row } from 'antd';

interface CommentersListNavProps {
  setCurrentPage: Function;
  currentPage: number;
  numberOfPages: number;
}

export const CommentersListNav: FunctionComponent<CommentersListNavProps> = (props: CommentersListNavProps) => {
  const { t } = useTranslation();
  const { currentPage, setCurrentPage, numberOfPages } = props;

  const onNext = () => {
    if (currentPage + 1 < numberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Row className="commenters-nav" justify="space-between">
      <span className="icon" onClick={onPrevious}>
        <img src={icons.leftArrow.icon} />
        <span className="nav-text">{t(PREV)}</span>
      </span>
      <Row>
        {Array.from({ length: numberOfPages }).map((elm, index) => {
          if (index == currentPage) {
            return <img className="circle" key={index} src={icons.midCircle.icon} />;
          }
          return <img className="circle" key={index} src={icons.circle.icon} />;
        })}
      </Row>
      <span className="icon" onClick={onNext}>
        <span className="nav-text">{t(NEXT)}</span>
        <img src={icons.rightArrow.icon} />
      </span>
    </Row>
  );
};

export default CommentersListNav;
