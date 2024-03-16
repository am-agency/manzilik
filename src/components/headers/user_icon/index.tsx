import { Avatar, Button, Dropdown, Menu, Row, Tooltip, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { getLayoutDirection } from '../../../app/layouts';
import { LOGIN_ROUTE, PROFILE_ROUTE, PROJECTS_ROUTE } from '../../../utils/routes';
import {
  EDIT_PROFILE,
  LOGIN,
  LOGOUT,
  MANAGE_GIGS,
  MY_PROJECTS,
  REQUESTS_WORKS_ON,
  SERVICE_REQUESTS,
  UNDER_REVIEW,
  VIEW_AS,
} from '../../../locales/strings';
import { useMainContext } from '../../../app/providers/main';
import { logoutUser } from '../../../pages/auth/signup/api';
import { useHistory } from 'react-router-dom';
import { logoutActionCreator } from '../../../app/providers/main/actions';
import { PopoverPlacement } from '../../dropdown_popover/types';
import { AR } from '../../../locales/constants';
import { useTranslation } from 'react-i18next';
import { ClientStatus } from '../../../pages/professionals/types';
import { profileIcons } from '../../../assets/icons/profile';
import { useClient } from '../../../app/hooks/use_client';
import Separator from '../../separator';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { textSubstring } from '../../../utils';
import { GIG_SERVICES_FEATURE, HOMEOWNER, SERVICE_INQUIRY_FEATURE } from '../../../app/settings';
import { useFeatures } from 'flagged';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import TutorialCard from '../../tutorial_card';
import { TutorialContext, TutorialInterface } from '../../../context/tutorial_context';
interface UserIconProps {
  isMobile?: boolean;
}

const UserIcon = (props: UserIconProps) => {
  const { isMobile = false } = props;
  const { userState, dispatchUser, requestApi, userName } = useMainContext();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const isHomePage = history.location.pathname == '/';
  const { clientData: client, isProfessional } = useContext(SharedStateContext) as SharedStateInterface;
  const { xs } = useBreakpoint();
  const [viewAsDynamicLink, setViewAsDynamicLink] = useState('');
  const features = useFeatures();
  const { setPointerPosition, stepIncremental, setShowTutorial } = useContext(TutorialContext) as TutorialInterface;

  useEffect(() => {
    if (userState.isAuthenticated) {
      if (userState?.role === HOMEOWNER) {
        setViewAsDynamicLink(`/client/${client?.id}`);
      } else {
        setViewAsDynamicLink(`/professional/${client?.id}`);
      }
    }
  }, [userState, client?.id]);

  const onLoginHandler = () => {
    history.push(LOGIN_ROUTE);
  };
  const onLogoutHandler = () => {
    requestApi(logoutUser, {}, () => {
      history.push('/');
      dispatchUser(logoutActionCreator());
      localStorage.removeItem('sendbird_user_id');
      localStorage.removeItem('sendbird_access_token');
      localStorage.removeItem('Professional');
      localStorage.removeItem('isProf');
      localStorage.removeItem('companyLogo');
      localStorage.removeItem('hasShownBanner');
      localStorage.removeItem('clientType');
      window.location.reload();
    });
  };

  const handleViewAsNewTab = () => {
    window.open(viewAsDynamicLink, '_blank');
  };

  const servicesConditionTitle = isProfessional ? t(REQUESTS_WORKS_ON) : t(SERVICE_REQUESTS);
  const servicesConditionLink = isProfessional
    ? `${PROFILE_ROUTE}/requests-works-on`
    : `${PROFILE_ROUTE}/service-requests`;

  return (
    <Row justify="center" align="middle">
      {userState.isAuthenticated ? (
        <Dropdown
          trigger={['click', 'hover']}
          overlayClassName={`${getLayoutDirection(i18n.language)}`}
          onVisibleChange={(visible) => {
            if (visible) {
              stepIncremental(2);
              setPointerPosition!('left');
            } else {
              setShowTutorial!(false);
            }
          }}
          overlay={
            <Menu>
              <Menu.Item onClick={() => history.push(PROFILE_ROUTE)}>{t(EDIT_PROFILE)}</Menu.Item>
              {features[SERVICE_INQUIRY_FEATURE] && (
                <Menu.Item onClick={() => history.push(servicesConditionLink)}>{servicesConditionTitle}</Menu.Item>
              )}
              {features[GIG_SERVICES_FEATURE] && isProfessional && (
                <Menu.Item onClick={() => history.push(`${PROFILE_ROUTE}/my-gigs`)}>{t(MANAGE_GIGS)}</Menu.Item>
              )}

              <Menu.Item onClick={handleViewAsNewTab}>{t(VIEW_AS)}</Menu.Item>
              <Menu.Item onClick={() => history.push(PROJECTS_ROUTE)}>{t(MY_PROJECTS)}</Menu.Item>
              <Menu.Item onClick={onLogoutHandler}>{t(LOGOUT)}</Menu.Item>
            </Menu>
          }
          placement={i18n.language === AR ? PopoverPlacement.BOTTOMRIGHT : PopoverPlacement.BOTTOMLEFT}
          arrow
        >
          <Tooltip
            visible={userState?.client?.status === ClientStatus.PENDING}
            title={t(UNDER_REVIEW)}
            color={'#EABB37'}
            overlayClassName={`menu-tooltip ${getLayoutDirection(i18n.language)} ${
              isHomePage ? 'homepage-tooltip' : 'default-menu-tooltip'
            }`}
          >
            <Row justify="end" align="middle" className="avatar-name-wrapper">
              <Avatar
                shape="circle"
                icon={<img src={profileIcons.avatar} />}
                src={client?.profile_image || userState?.user?.picture}
                size={xs ? 30 : 32}
              />
              <Separator horizontal={4} />
              {!isMobile && (
                <Tooltip placement="right" title={userName}>
                  <Typography.Text ellipsis strong className="username-text">
                    {textSubstring(userName, 10)}
                  </Typography.Text>
                </Tooltip>
              )}
            </Row>
          </Tooltip>
        </Dropdown>
      ) : (
        <>
          <Button type="primary" onClick={onLoginHandler} className="login-btn" shape="round">
            {t(LOGIN)}
          </Button>
        </>
      )}
    </Row>
  );
};

export default UserIcon;
