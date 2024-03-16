import React, { FunctionComponent, useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Dropdown, Menu, Modal, Row, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { LOGIN, LOGOUT, EDIT_PROFILE, UNDER_REVIEW, MY_PROJECTS } from '../../locales/strings';
import Logo from '../logo';
import { getUserName, saveLanguageToStorage } from '../../utils';
import { useMainContext } from '../../app/providers/main';
import { logoutActionCreator } from '../../app/providers/main/actions';
import { logoutUser } from '../../pages/auth/signup/api';
import { Link, useHistory, useLocation } from 'react-router-dom';
import icons from '../../assets/icons';
import { LanguageSwitch } from '../language_switch';
import Avatar from '../avatar';
import { CHECKOUT_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, PROJECTS_ROUTE } from '../../utils/routes';
import { useClient } from '../../app/hooks/use_client';
import { SearchAutoComplete } from '../../pages/ideas/auto_complete';
import { getLayoutDirection } from '../../app/layouts';
import { MenuItems } from './menu_items';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import Separator from '../separator';
import { PopoverPlacement } from '../dropdown_popover/types';
import { AR } from '../../locales/constants';
import { getLanguageFromURL } from './utils';
import { useIntercom } from 'react-use-intercom';
import { headerIcons } from '../../assets/icons/header';
import { searchIcons } from '../../assets/icons/search';
import { WHITE } from '../../pages/projects/constants';
import { useFeature, useFeatures } from 'flagged';
import { ECOMMERCE_FEATURE, SERVICE_CHAT } from '../../app/settings';
import { ClientStatus } from '../../pages/professionals/types';
import { profileIcons } from '../../assets/icons/profile';
import UserIcon from './user_icon';
import MobileMenu from '../mobile_menu';
import { Notifications } from './notifications/notifications';
import { ChatIcon } from './chat_icon';
import { useSendBirdContext } from '../../context/sendbird_context';
import TutorialCard from '../tutorial_card';

const UserHeader: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { xs, sm, md, lg } = useBreakpoint();
  const { userState, dispatchUser, requestApi } = useMainContext();
  const isHomePage = history.location.pathname == '/';
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isMobileView = useMediaQuery({ query: '(max-width: 640px)' });
  const features = useFeatures();
  const isEcommerce = useFeature(ECOMMERCE_FEATURE);

  const onLanguageChange = (lng: string) => {
    saveLanguageToStorage(lng);
    i18n.changeLanguage(lng);
  };

  const onLoginHandler = () => {
    history.push(LOGIN_ROUTE);
  };

  const onShowSearchModal = () => {
    setIsVisible(true);
  };

  const { totalUnreadMessageCount } = useSendBirdContext();

  const renderLoggedInMenuItems = () =>
    userState.isAuthenticated && (
      <Row>
        <>
          {features[SERVICE_CHAT] && <ChatIcon />}

          <Separator horizontal={9} responsive />
        </>

        <Notifications isMobileView={isMobileView} />
        <Separator horizontal={9} responsive />
        {isEcommerce && (
          <>
            <Link to={CHECKOUT_ROUTE}>
              <Badge count={userState.basket?.total_quantity} className="cart-badge">
                <img src={headerIcons.cart} />
              </Badge>
            </Link>
            <Separator horizontal={9} responsive />
          </>
        )}
      </Row>
    );

  useEffect(() => {
    const lang = getLanguageFromURL(location.search);
    onLanguageChange(lang!);
  }, []);

  useEffect(() => {
    setIsVisible(false);
  }, [history?.location?.pathname]);

  return isMobileView ? (
    <MobileMenu />
  ) : (
    <Row justify="center" align="middle" wrap={false}>
      <Col
        xl={isHomePage ? 21 : 24}
        lg={isHomePage ? 21 : 24}
        md={isHomePage ? 23 : 24}
        sm={isHomePage ? 23 : 24}
        xs={isHomePage ? 23 : 24}
        className={`header-content-container ${isHomePage ? 'homepage-header' : 'default-header'}`}
      >
        <Row justify="center">
          <Col xl={24} lg={24} md={24} sm={24} xs={24} className="header-content-wrapper">
            <Row
              align="middle"
              justify={!isMobileView ? 'space-between' : 'space-around'}
              wrap={false}
              className={`all-elements-wrapper ${getLayoutDirection(i18n.language)}`}
            >
              <Logo color={WHITE} />
              {isMobileView && <Separator horizontal={2} />}
              <Row>
                {!isMobileView && (
                  <>
                    <MenuItems />
                    <Separator horizontal={10} responsive />
                  </>
                )}
                <Row
                  justify="space-between"
                  align="middle"
                  wrap={false}
                  className={`user-language-wrapper ${getLayoutDirection(i18n.language)}`}
                >
                  <UserIcon />

                  <Separator horizontal={9} responsive />
                  {renderLoggedInMenuItems()}
                  <LanguageSwitch onLanguageChange={onLanguageChange} />
                  <Separator horizontal={!isMobileView ? 5 : 10} responsive />
                  <Row justify="center" align="middle" className="search-wrapper clickable" onClick={onShowSearchModal}>
                    <img src={searchIcons.whiteSearch} alt="search icon" />
                  </Row>
                  <Modal
                    onCancel={() => setIsVisible(false)}
                    destroyOnClose
                    closable={false}
                    forceRender={true}
                    visible={isVisible}
                    className={`modal-wrapper search-modal ${getLayoutDirection(i18n.language)}`}
                  >
                    <SearchAutoComplete searchSpan={24} btnSpan={0} />
                  </Modal>
                </Row>
              </Row>
            </Row>
            {isMobileView && (
              <>
                <Row justify={'space-around'} gutter={16}>
                  <Col flex={1}>
                    <MenuItems />
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default UserHeader;
