import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../app/i18n';
import { getLayoutDirection } from '../../app/layouts';
import { headerIcons } from '../../assets/icons/header';
import { DOWNLOAD, DOWNLOAD_MANZILIK_APP, DOWNLOAD_MANZILIK_APP_DESC } from '../../locales/strings';
import { useHistory } from 'react-router-dom';

const WebToApp: FunctionComponent = (props) => {
  const { t } = useTranslation();
  const androidLink = 'https://play.google.com/store/apps/details?id=com.manzilik.app';
  const iosLink = 'https://apps.apple.com/app/id1576679029';
  const langDirection = getLayoutDirection(i18n.language);
  const history = useHistory();
  const pathname = history.location.pathname;

  const isContainsManzilikAi = pathname.includes('/manzilik-ai');

  const closeWebToApp = () => {
    const webToApp = document.querySelector('.webToApp');
    webToApp?.classList.add('hide');
  };
  const openApp = () => {
    const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
    const isIos = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    if (isAndroid) {
      window.open(androidLink, '_blank');
    } else if (isIos) {
      window.open(iosLink, '_blank');
    } else {
      window.open(androidLink, '_blank');
    }
  };

  return (
    <>
      {isContainsManzilikAi ? null : (
        <div
          className="webToApp"
          style={{
            direction: langDirection,
          }}
        >
          <div className="webToAppContainer">
            <p className="closeIcon" onClick={closeWebToApp}>
              x
            </p>
            <img src={headerIcons.mobileWhiteLogo} alt="logo" />
            <div>
              <p className="title">{t(DOWNLOAD_MANZILIK_APP)}</p>
              <p className="subTitle">{t(DOWNLOAD_MANZILIK_APP_DESC)}</p>
            </div>
            <button onClick={openApp}>{t(DOWNLOAD)}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default WebToApp;
