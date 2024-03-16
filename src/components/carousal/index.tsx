import React, { useEffect, useState, ReactNode } from 'react';
import i18n from '../../app/i18n';
import { SMOOTH } from '../../app/settings';
import { AR, EN } from '../../locales/constants';
import { Button } from 'antd';
import icons from '../../assets/icons';

interface Props {
  children: ReactNode;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  // hide arrows when getting the last element of the scrollable section
  hideArrows?: boolean;
}

export const CustomCarousal = ({ children, id, action, hideArrows = true }: Props) => {
  const [leftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [rightArrow, setShowRightArrow] = useState<boolean>(false);

  const onScrolToLeft = () => {
    const element = document.getElementById(id);
    element!.scrollLeft -= 500;
    element!.style.scrollBehavior = SMOOTH;
    const isLastElement =
      i18n.language == EN ? element?.scrollLeft == 0 : element?.scrollWidth! / 2 < -element?.scrollLeft!;
    if (isLastElement && hideArrows) {
      setShowLeftArrow(false);
    } else {
      setShowRightArrow(true);
    }
  };

  const onScrollToRight = () => {
    const element = document.getElementById(id);
    element!.scrollLeft += 500;
    element!.style.scrollBehavior = SMOOTH;
    const isLastElement =
      i18n.language == AR ? element?.scrollLeft == 0 : element?.scrollWidth! / 2 < element?.scrollLeft!;
    if (isLastElement && hideArrows) {
      setShowRightArrow(false);
    } else {
      setShowLeftArrow(true);
    }
  };

  useEffect(() => {
    const element = document.getElementById(id);
    if (element?.scrollWidth! > element?.clientWidth!) {
      i18n.language == AR ? setShowLeftArrow(true) : setShowRightArrow(true);
    } else {
      setShowLeftArrow(false);
      setShowRightArrow(false);
    }

    if (action == '') {
      setShowLeftArrow(false);
      setShowRightArrow(false);
    }
  }, [action]);

  return (
    <>
      {rightArrow && (
        <Button className={`right-arrow arrows ${i18n.language}`} onClick={onScrollToRight}>
          <img src={icons.rightArrow.icon} alt="right arrow icon" />
        </Button>
      )}
      {children}
      {leftArrow && (
        <Button className={`left-arrow arrows ${i18n.language}`} onClick={onScrolToLeft}>
          <img src={icons.leftArrow.icon} alt="left arrow icon" />
        </Button>
      )}
    </>
  );
};
