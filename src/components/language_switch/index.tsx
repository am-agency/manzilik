import { Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import icons from '../../assets/icons';
import { AR, EN } from '../../locales/constants';
import Separator from '../separator';

const languages = [
  { ...icons.arabic_flag, value: AR },
  { ...icons.english_flag, value: EN },
];

interface Props {
  onLanguageChange: Function;
}

export const LanguageSwitch = (props: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      {languages.map((lng, index) => {
        if (i18n.language !== lng.value) {
          return (
            <Row
              key={lng.value}
              justify="center"
              align="middle"
              className="language-switch"
              onClick={() => props.onLanguageChange(lng.value)}
            >
              <div className="language-wrapper" key={lng.title}>
                {t(lng.title)}
              </div>
            </Row>
          );
        }
      })}
    </div>
  );
};
