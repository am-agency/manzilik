import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AI_GUIDE_1,
  AI_GUIDE_2,
  AI_GUIDE_3,
  AI_GUIDE_4,
  AI_GUIDE_5,
  AI_GUIDE_6,
  AI_GUIDE_7,
  SOME_GUIDES,
} from '../../../../locales/strings';

const GuidePoints = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p className="guide-title">{t(SOME_GUIDES)}</p>
      <ul>
        <li>{t(AI_GUIDE_1)}</li>
        <li className="guide-bolded">{t(AI_GUIDE_2)}</li>
        <li>
          {t(AI_GUIDE_3)}
          <ul>
            <li>{t(AI_GUIDE_4)}</li>
            <li>{t(AI_GUIDE_5)}</li>
            <li>{t(AI_GUIDE_6)}</li>
            <li>{t(AI_GUIDE_7)}</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default GuidePoints;
