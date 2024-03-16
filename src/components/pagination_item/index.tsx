import { JumpNext, JumpPrev, Next, Prev } from '../../app/settings';
import { NEXT_PAGE, PREV_PAGE } from '../../locales/strings';
import React from 'react';
import { AR } from '../../locales/constants';
import icons from '../../assets/icons';
import i18n from '../../app/i18n';
import { TFunction } from 'i18next';

export type PaginationType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';

export const CustomPagination = (page: number, type: PaginationType, t: TFunction) => {
  const isArabic = i18n.language === AR;
  const arrowDirectionRtl = isArabic ? icons.rightArrow.icon : icons.leftArrow.icon;
  const arrowDirectionLtr = isArabic ? icons.leftArrow.icon : icons.rightArrow.icon;

  if (type === Prev) {
    return (
      <a className="navigator">
        <img src={arrowDirectionRtl} /> {t(PREV_PAGE)}
      </a>
    );
  }

  if (type === JumpNext || type === JumpPrev) {
    return <a className="navigator">...</a>;
  }

  if (type === Next) {
    return (
      <a className="navigator">
        {t(NEXT_PAGE)} <img src={arrowDirectionLtr} />
      </a>
    );
  }
  return page;
};
