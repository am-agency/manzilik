import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { footerIcons } from '../../assets/icons/footer';
import { APP_STORE, AVAILABLE_APPLE, GET_APPLICATION, GOOGLE_PLAY } from '../../locales/strings';
import { GOOGLE_PLAY_APP_LINK, APPLE_APP_LINK } from '../../app/settings';

export const AppleButton = () => {
  const { t } = useTranslation();
  return (
    <a href={APPLE_APP_LINK} target="_blank" rel="noreferrer">
      <Button icon={<img src={footerIcons.apple.icon} />} type="primary">
        <>
          <p> {t(AVAILABLE_APPLE)} </p>
          {t(APP_STORE)}
        </>
      </Button>
    </a>
  );
};

export const GooglePlayButton = () => {
  const { t } = useTranslation();

  return (
    <a href={GOOGLE_PLAY_APP_LINK} target="_blank" rel="noreferrer">
      <Button icon={<img src={footerIcons.googlePlay.icon} />} type="primary">
        <>
          <p>{t(GET_APPLICATION)}</p>
          {t(GOOGLE_PLAY)}
        </>
      </Button>
    </a>
  );
};
