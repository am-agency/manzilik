import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../app/i18n';
import { getLayoutDirection } from '../../app/layouts';
import { headerIcons } from '../../assets/icons/header';
import { LOGIN } from '../../locales/strings';
import CartIcon from '../headers/cart_icon';
import { useMainContext } from '../../app/providers/main';
import { useHistory } from 'react-router-dom';
import SearchIcon from '../headers/search_icon';
import UserIcon from '../headers/user_icon';
import { LOGIN_ROUTE } from '../../utils/routes';
import MobileSidebar from './mobile_sidebar';
import { useMediaQuery } from 'react-responsive';
import { Notifications } from '../headers/notifications/notifications';
import { ChatIcon } from '../headers/chat_icon';
import { useFeature } from 'flagged';
import { ECOMMERCE_FEATURE } from '../../app/settings';

const MobileMenu = () => {
  const langDirection = getLayoutDirection(i18n.language);
  const { userState } = useMainContext();
  const isLogged = userState.isAuthenticated;
  const isMobileView = useMediaQuery({ query: '(max-width: 640px)' });
  const isEcommerce = useFeature(ECOMMERCE_FEATURE);

  const { push } = useHistory();
  const onLoginHandler = () => {
    push(LOGIN_ROUTE);
  };
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const { t } = useTranslation();

  return (
    <div
      className="mobile-menu-wrapper"
      style={{
        direction: langDirection,
      }}
    >
      <div className="mobile-menu-main">
        <div className="left-side-menu">
          <div className="menu-icon" onClick={toggleSidebar}>
            <img src={headerIcons.menu_icon} />
          </div>
          <MobileSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <img
            src={isLogged ? headerIcons.mobileWhiteLogo : headerIcons.whiteWideLogo}
            className={isLogged ? 'white-logo' : ''}
            onClick={() => push('/')}
          />
        </div>
        <div className="right-side-menu">
          {isLogged ? (
            <div className="user-menu">
              <ChatIcon />
              <Notifications isMobileView={isMobileView} />
              {isEcommerce && <CartIcon count={parseInt(userState.basket?.total_quantity!)} />}
              <UserIcon isMobile />
            </div>
          ) : (
            <div className="user-menu-login-btn">
              <div className="login-btn" onClick={onLoginHandler}>
                <p>{t(LOGIN)}</p>
              </div>
            </div>
          )}
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
