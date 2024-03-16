/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import icons from '../../assets/icons';
import { Professional } from '../../API';
import { useMainContext } from '../../app/providers/main';
import { ClientStatus } from '../../pages/professionals/types';
import {
  FOLLOWERS,
  FOLLOWING,
  HOMEOWNER,
  HOME_OWNER,
  LOGOUT,
  PROFESSIONAL,
  UNDER_REVIEW,
  VIEW_AS,
} from '../../locales/strings';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';
import { logoutUser } from '../../pages/auth/signup/api';
import { logoutActionCreator } from '../../app/providers/main/actions';
import Referral from '../../pages/manzilik_ai/components/referral';
import { useFeature } from 'flagged';
import { REFERRAL_FLAG } from '../../app/settings';
import { ReferralViewType } from '../../constants';
import UserPoints from '../../pages/manzilik_ai/components/user_points';
import { PlusOutlined } from '@ant-design/icons';
import ShareProfile from '../share_profile';

interface ProfileSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
  onUserIconClick?: () => void;
  selectedItemId?: string;
  setSelectedItemId?: (id: string) => void;
  profileMainMenuList?: {
    id: string;
    title: string;
    icon: string;
  }[];
}

const ProfileSidebar = (props: ProfileSidebarProps) => {
  const { showSidebar, setShowSidebar, onUserIconClick, profileMainMenuList, selectedItemId, setSelectedItemId } =
    props;
  const { userName, userState, requestApi, dispatchUser } = useMainContext();
  const [viewAsDynamicLink, setViewAsDynamicLink] = useState('');

  const { clientData: client, isProfessional, professional } = useContext(SharedStateContext) as SharedStateInterface;

  const { t } = useTranslation();
  const history = useHistory();

  const isUserPending = userState?.client?.status === ClientStatus.PENDING;
  const isReferralFlagOn = useFeature(REFERRAL_FLAG);

  const onItemClicked = (id: string) => {
    history.push(`/edit-profile/${id}`);
    setSelectedItemId!(id);
    setShowSidebar(false);
  };
  const onLogoutHandler = () => {
    requestApi(logoutUser, {}, () => {
      history.push('/');
      dispatchUser(logoutActionCreator());
      localStorage.removeItem('sendbird_user_id');
      localStorage.removeItem('sendbird_access_token');
    });
  };
  useEffect(() => {
    if (userState.isAuthenticated) {
      if (userState?.role === HOMEOWNER) {
        setViewAsDynamicLink(`/client/${client?.id}`);
      } else {
        setViewAsDynamicLink(`/professional/${client?.id}`);
      }
    }
  }, [userState, client?.id]);
  return (
    <div className="profile-sidebar-wrapper">
      <div className={`profile-sidebar ${showSidebar ? 'show overlay' : ''}`}>
        <div className="profile-sidebar-content">
          <div className="account-info">
            <img src={icons.profileInfo.my_account} alt="my account" onClick={onUserIconClick} />
            <div className="user-details">
              <p className="user-name">{userName}</p>
              <div className="user-type">
                <div className="icon-wrapper">
                  <img src={icons.UserProfile} alt="profile" />
                  <p>{t(isProfessional ? PROFESSIONAL : HOMEOWNER)}</p>
                </div>
                {isProfessional && (
                  <div className="icon-wrapper">
                    <img src={icons.Users} alt="profile" />
                    <p>{`${client?.followers_count || 0} ${t(FOLLOWERS)}`}</p>
                  </div>
                )}

                {isUserPending ? <p> - {t(UNDER_REVIEW)}</p> : null}
              </div>
            </div>
          </div>
          {isProfessional && (
            <div className="show-to-people" onClick={() => history.push(viewAsDynamicLink)}>
              <img src={icons.profileInfo.eye_icon} alt="eye icon" />
              <p>{t(VIEW_AS)}</p>
            </div>
          )}
          {!isProfessional && <UserPoints />}

          <div className="profile-menu-list">
            {profileMainMenuList?.map((item: any) => {
              return (
                <div className="list-item-profile" key={item?.id} onClick={() => onItemClicked(item?.id)}>
                  <img src={selectedItemId === item?.id ? item.icon : item?.inActiveIcon} alt={item.title} />
                  <span className={selectedItemId === item?.id ? 'bolded' : ''}>{item.title}</span>
                </div>
              );
            })}
          </div>
          <div className="log-out-mobile" onClick={onLogoutHandler}>
            <img src={icons.profileInfo.log_out_mobile} alt="log out" />
            <span>{t(LOGOUT)}</span>
          </div>
          {isProfessional && <ShareProfile link={professional?.public_profile_deep_link!} />}
          {isReferralFlagOn && <Referral viewType={ReferralViewType.SMALL} />}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
