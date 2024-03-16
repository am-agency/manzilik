import { Alert, Button, Col, Row, Tabs } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withUserAuthenticator } from '../../../app/providers/user/with_user_authenticator';
import icons from '../../../assets/icons';
import { AR } from '../../../locales/constants';

import {
  ACCOUNT,
  ADDRESSES,
  ADVANCED_SETTINGS,
  CONTACT_INFO,
  COUNTRY_CITY,
  EDIT_PROFILE,
  HOME_PAGE_SEO_DESCRIPTION,
  IMAGES,
  LOGIN,
  MANAGE_GIGS,
  MANAGE_IDEAS,
  MANAGE_REQUESTS,
  MANAGE_VIDEOS,
  MANZILIK,
  MY_ACCOUNT,
  MY_ORDERS,
  PASSWORD,
  PRIVACY_SETTINGS,
  PROFESSIONAL,
  PROFILE_IDEAS,
  PROFILE_INFO,
  PROFILE_INFORMATION,
  PROFILE_VIDEOS,
  REQUESTS_WORKS_ON,
  SERVICE_REQUESTS,
  SOCIAL_MEDIA_SETTINGS,
  UPDATE,
  VIDEOS,
  YOUR_PROFILE_PHOTO,
  YOU_NEE_TO_LOGIN,
} from '../../../locales/strings';

import { useFeature, useFeatures } from 'flagged';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { Client, EditClientProfileInput } from '../../../API';
import { getLayoutDirection } from '../../../app/layouts';
import { useMainContext } from '../../../app/providers/main';
import { setClientActionCreator } from '../../../app/providers/main/actions';
import { useModal } from '../../../app/providers/modal';
import {
  CHANGE_PASSWORD,
  ECOMMERCE_FEATURE,
  GIG_SERVICES_FEATURE,
  REFERRAL_FLAG,
  REQUEST_FOR_QUOTATION,
  SERVICE_INQUIRY_FEATURE,
  TabPosition,
} from '../../../app/settings';
import { UserRole } from '../../../app/types';
import { profileIcons } from '../../../assets/icons/profile';
import { CropImage } from '../../../components/crop_img';
import { MetaTags } from '../../../components/meta_tags';
import { ModalTitle } from '../../../components/modal_title';
import Separator from '../../../components/separator';
import { COMPLETE_PROFILE_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from '../../../utils/routes';
import { AdvancedSettings } from '../advanced_settings';
import { getClientAddresses, updateAccountInformation } from '../api';
import { PrivacySettings } from '../privacy_settings';
import SocialMediaAccount from '../social_media_accounts';
import { AddressesTab } from './addresses';
import { BasicInfo } from './components/tab_panes/basic_info';
import { ContactInformation } from './components/tab_panes/contact_information';
import { ProfessionalImages } from './components/tab_panes/professional_images';
import { ProfessionalVideos } from './components/tab_panes/professional_videos';
import { MyOrders } from './my_orders';
import { ServiceRequestsList } from './service_requests/service_requests_list';
import MyListGigs from './my_gigs/my_gigs_list';
import * as analytics from '../../../analytics';
import { ProfileHeader } from '../../../components/profile_header';
import { useClient } from '../../../app/hooks/use_client';
import InDismissibleAlert from '../../../components/in_dismissible_alert';
import { CompleteProfileContext } from '../../../context/complete_profile_context';
import ProfileSidebar from '../../../components/profile_sidebar';
import { useMediaQuery } from 'react-responsive';
import Referral from '../../manzilik_ai/components/referral';
import { ReferralViewType } from '../../../constants';
import { RequestsWorksOnList } from './requests_works_on/requests_works_on_list';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import { profileSideMenuIcons } from '../../../assets/icons/profile/sidemenu';
import { a } from 'aws-amplify';
import ShareProfile from '../../../components/share_profile';

const { TabPane } = Tabs;

interface ProfileParams {
  tabId: string;
}

export enum TabId {
  PROFILE_IMAGE = 'profile-image',
  MY_GIGS = 'my-gigs',
  PROFILE_INFO = 'profile-info',
  CONTACT_INFO = 'contact-info',
  MY_ORDERS = 'my-orders',
  ADDRESSES = 'addresses',
  PASSWORD = 'password',
  PRIVACY_SETTINGS = 'privacy-settings',
  SOCIAL_MEDIA_SETTINGS = 'social-media-settings',
  PROFILE_IDEAS = 'profile-ideas',
  PROFILE_VIDEOS = 'profile-videos',
  ADVANCED_SETTINGS = 'advanced-settings',
  SERVICE_REQUESTS = 'service-requests',
  REQUESTS_WORKS_ON = 'requests-works-on',
}

const EditProfile = () => {
  const { t, i18n } = useTranslation();
  const { requestApi, userState, dispatchUser, professional } = useMainContext();
  const { showModal } = useModal();
  const history = useHistory();
  const { location } = useHistory();

  // TODO: refactor into navigation. ref: PR 492
  const params = useParams<ProfileParams>();
  const [activeTabId, setActiveTabId] = useState<string>(TabId.PROFILE_INFO);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [showCropImageModal, toggleShowCropImageModal] = useState<boolean>(false);
  const { client, initClient } = useClient();
  const isEcommerce = useFeature(ECOMMERCE_FEATURE);
  const isReferralFlagOn = useFeature(REFERRAL_FLAG);
  const features = useFeatures();
  const professionalId = useMemo(() => professional?.id, [professional?.id]);
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });
  const [selectedItemId, setSelectedItemId] = useState<string>(TabId.PROFILE_INFO);

  const [profileMainMenuList, setProfileMainMenuList] = useState([
    {
      id: TabId.SERVICE_REQUESTS,
      icon: profileSideMenuIcons.manageRequestsActive,
      inActiveIcon: profileSideMenuIcons.manageRequestsInActive,
      title: t(MANAGE_REQUESTS),
    },
    {
      id: TabId.REQUESTS_WORKS_ON,
      icon: profileSideMenuIcons.manageRequestsActive,
      inActiveIcon: profileSideMenuIcons.manageRequestsInActive,
      title: t(REQUESTS_WORKS_ON),
    },
    {
      id: TabId.MY_GIGS,
      icon: profileSideMenuIcons.manageGigsActive,
      inActiveIcon: profileSideMenuIcons.manageGigsInActive,
      title: t(MANAGE_GIGS),
    },
    {
      id: TabId.PROFILE_IDEAS,
      icon: profileSideMenuIcons.imagesActive,
      inActiveIcon: profileSideMenuIcons.imagesInActive,
      title: t(MANAGE_IDEAS),
    },
    {
      id: TabId.PROFILE_VIDEOS,
      icon: profileSideMenuIcons.videosActive,
      inActiveIcon: profileSideMenuIcons.videosInActive,
      title: t(MANAGE_VIDEOS),
    },
    {
      id: TabId.PROFILE_INFO,
      icon: profileSideMenuIcons.editActive,
      inActiveIcon: profileSideMenuIcons.editInActive,
      title: t(EDIT_PROFILE),
    },

    {
      id: TabId.CONTACT_INFO,
      icon: profileSideMenuIcons.cityActive,
      inActiveIcon: profileSideMenuIcons.cityInActive,
      title: t(COUNTRY_CITY),
    },

    // {
    //   id: TabId.PROFILE_IMAGE,
    //   icon: icons.profileInfo.images_mobile,
    //   title: t(IMAGES),
    // },
    {
      id: TabId.SOCIAL_MEDIA_SETTINGS,
      icon: profileSideMenuIcons.socialActive,
      inActiveIcon: profileSideMenuIcons.socialInActive,
      title: t(SOCIAL_MEDIA_SETTINGS),
    },
    {
      id: TabId.PASSWORD,
      icon: profileSideMenuIcons.passwordActive,
      inActiveIcon: profileSideMenuIcons.passwordInActive,
      title: t(PASSWORD),
    },

    {
      id: TabId.ADVANCED_SETTINGS,
      icon: profileSideMenuIcons.settingsActive,
      inActiveIcon: profileSideMenuIcons.settingsInActive,
      title: t(ADVANCED_SETTINGS),
    },
    // {
    //   id: TabId.PRIVACY_SETTINGS,
    //   icon: icons.profileInfo.privacy_settings,
    //   title: t(PRIVACY_SETTINGS),
    // },
  ]);

  useEffect(() => {
    // remove Tabid.MY_GIGS and REQUESTS_WORKS_ON from profileMainMenuList if user is not professional
    if (!isProfessional) {
      setProfileMainMenuList(
        profileMainMenuList.filter(
          (item) =>
            item.id !== TabId.MY_GIGS &&
            item.id !== TabId.REQUESTS_WORKS_ON &&
            item.id !== TabId.PROFILE_IDEAS &&
            item.id !== TabId.PROFILE_VIDEOS
        )
      );
    }
    if (isProfessional) {
      setProfileMainMenuList(profileMainMenuList.filter((item) => item.id !== TabId.SERVICE_REQUESTS));
    }
  }, [isProfessional]);

  useEffect(() => {
    if (isEcommerce) {
      setProfileMainMenuList([
        ...profileMainMenuList.splice(0, 2),
        {
          id: TabId.MY_ORDERS,
          icon: icons.profileInfo.my_orders_mobile,
          inActiveIcon: icons.profileInfo.my_orders_mobile,
          title: t(MY_ORDERS),
        },
        {
          id: TabId.ADDRESSES,
          icon: icons.profileInfo.adresses_mobile,
          inActiveIcon: icons.profileInfo.adresses_mobile,
          title: t(ADDRESSES),
        },
        ...profileMainMenuList.splice(2),
      ]);
    }
  }, [isEcommerce]);

  const { isProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    isProfessionalCompleteProfile: boolean;
  };

  const getProfFromLocalStorage = () => {
    const prof = localStorage.getItem('Professional');
    if (prof) {
      return JSON.parse(prof);
    }
    return null;
  };
  const is_gig_professional = useMemo(
    () => getProfFromLocalStorage()?.is_gig_professional,
    [getProfFromLocalStorage()?.is_gig_professional]
  );
  const isManageGigsEnabled = useFeature(GIG_SERVICES_FEATURE);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const toggleSidebar = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    setActiveTabId(params.tabId);
    setSelectedItemId(params.tabId);
  }, [params]);

  const getClientData = () => {
    requestApi(getClientAddresses, { limit: 50, offset: 0 }, (client: Client, error: string) => {
      if (error) {
        return;
      }
      initClient();
    });
  };

  const onUpdateClientInformation = (values: EditClientProfileInput) => {
    requestApi(updateAccountInformation, values, (response: Client) => {
      if (Object.keys(response).length !== 0) {
        dispatchUser(
          setClientActionCreator({ __typename: 'Client', id: client?.id!, ...(client || {}), ...(values || {}) })
        );
        setSuccessMessage(true);
        history.push(PROFILE_ROUTE);
        initClient();
      }
    });
  };

  const onUpdateProfilePicture = (values: { url: string; base64: string }) => {
    requestApi(updateAccountInformation, { profile_image: values.url }, (response: Client) => {
      if (Object.keys(response).length !== 0) {
        setSuccessMessage(true);
        dispatchUser(setClientActionCreator({ ...(client! || {}), profile_image: values.base64 }));
      }
    });
  };

  const getTabPosition = () => {
    if (window.innerWidth <= 600) {
      return TabPosition.top;
    } else if (i18n.language === AR) {
      return TabPosition.right;
    }
    return TabPosition.left;
  };

  const onHandleClick = () => {
    toggleShowCropImageModal(!showCropImageModal);
    showModal(
      <ModalTitle icon={icons.user.icon} title={t(YOUR_PROFILE_PHOTO)} />,
      <CropImage onUpdateClientInformation={onUpdateProfilePicture} showModal={showCropImageModal} />,
      'modal-wrapper crop-img-modal',
      UPDATE
    );
  };

  const tabPanes = {
    basicInfo: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.PROFILE_INFO ? profileSideMenuIcons.editActive : profileSideMenuIcons.editInActive
              }
            />
            {t(PROFILE_INFO)}
          </>
        }
        key={TabId.PROFILE_INFO}
      >
        <BasicInfo
          client={client!}
          onUpdateClientInformation={onUpdateClientInformation}
          successMessage={successMessage}
        />
      </TabPane>
    ),
    myGigs: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.MY_GIGS
                  ? profileSideMenuIcons.manageGigsActive
                  : profileSideMenuIcons.manageGigsInActive
              }
            />
            {t(MANAGE_GIGS)}
          </>
        }
        key={TabId.MY_GIGS}
      >
        <MyListGigs professionalId={professionalId} />
      </TabPane>
    ),
    contact: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.CONTACT_INFO ? profileSideMenuIcons.cityActive : profileSideMenuIcons.cityInActive
              }
            />
            {t(COUNTRY_CITY)}
          </>
        }
        key={TabId.CONTACT_INFO}
      >
        <ContactInformation
          client={client!}
          onUpdateClientInformation={onUpdateClientInformation}
          successMessage={successMessage}
        />
      </TabPane>
    ),
    password: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.PASSWORD
                  ? profileSideMenuIcons.passwordActive
                  : profileSideMenuIcons.passwordInActive
              }
            />
            {t(PASSWORD)}
          </>
        }
        key={TabId.PASSWORD}
      >
        <Alert
          message={t(YOU_NEE_TO_LOGIN)}
          description={
            <>
              <Separator vertical={10} />
              <Button
                onClick={() => history.push(LOGIN_ROUTE + '/from=' + CHANGE_PASSWORD, { from: CHANGE_PASSWORD })}
                type="primary"
              >
                {t(LOGIN)}
              </Button>
            </>
          }
          type="info"
          showIcon={false}
        />
      </TabPane>
    ),
    social: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.SOCIAL_MEDIA_SETTINGS
                  ? profileSideMenuIcons.socialActive
                  : profileSideMenuIcons.socialInActive
              }
            />
            {t(SOCIAL_MEDIA_SETTINGS)}
          </>
        }
        key={TabId.SOCIAL_MEDIA_SETTINGS}
      >
        <SocialMediaAccount client={client} />
      </TabPane>
    ),
    advanced: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.ADVANCED_SETTINGS
                  ? profileSideMenuIcons.settingsActive
                  : profileSideMenuIcons.settingsInActive
              }
            />
            {t(ADVANCED_SETTINGS)}
          </>
        }
        key={TabId.ADVANCED_SETTINGS}
      >
        <AdvancedSettings />
      </TabPane>
    ),
    privacy: (
      <TabPane
        tab={
          <>
            <img src={icons.privacy.icon} /> {t(PRIVACY_SETTINGS)}
          </>
        }
        key={TabId.PRIVACY_SETTINGS}
      >
        <PrivacySettings />
      </TabPane>
    ),
    //professional
    images: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.PROFILE_IDEAS
                  ? profileSideMenuIcons.imagesActive
                  : profileSideMenuIcons.imagesInActive
              }
            />
            {t(MANAGE_IDEAS)}
          </>
        }
        key={TabId.PROFILE_IDEAS}
      >
        <ProfessionalImages client={client!} />
      </TabPane>
    ),
    videos: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.PROFILE_VIDEOS
                  ? profileSideMenuIcons.videosActive
                  : profileSideMenuIcons.videosInActive
              }
            />
            {t(MANAGE_VIDEOS)}
          </>
        }
        key={TabId.PROFILE_VIDEOS}
      >
        <ProfessionalVideos client={client!} />
      </TabPane>
    ),
    addresses: isEcommerce && (
      <TabPane
        tab={
          <>
            <img src={profileIcons.addresses} /> {t(ADDRESSES)}
          </>
        }
        key={TabId.ADDRESSES}
      >
        <AddressesTab client={client!} getClientData={getClientData} />
      </TabPane>
    ),
    myOrders: isEcommerce && (
      <TabPane
        tab={
          <>
            <img src={profileIcons.myOrders} /> {t(MY_ORDERS)}
          </>
        }
        key={TabId.MY_ORDERS}
      >
        <MyOrders client={client!} />
      </TabPane>
    ),
    serviceRequests: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.SERVICE_REQUESTS
                  ? profileSideMenuIcons.manageRequestsActive
                  : profileSideMenuIcons.manageRequestsInActive
              }
            />
            {t(MANAGE_REQUESTS)}
          </>
        }
        key={TabId.SERVICE_REQUESTS}
      >
        <ServiceRequestsList />
      </TabPane>
    ),
    requestsWorksOn: (
      <TabPane
        tab={
          <>
            <img
              src={
                activeTabId === TabId.REQUESTS_WORKS_ON
                  ? profileSideMenuIcons.manageGigsActive
                  : profileSideMenuIcons.manageGigsInActive
              }
            />
            {t(REQUESTS_WORKS_ON)}
          </>
        }
        key={TabId.REQUESTS_WORKS_ON}
      >
        <RequestsWorksOnList />
      </TabPane>
    ),

    referral: (
      <TabPane
        tab={
          <>
            <Referral viewType={ReferralViewType.SMALL} />
          </>
        }
        disabled
      />
    ),
    share_profile: (
      <TabPane
        tab={
          <>
            <ShareProfile link={professional?.public_profile_deep_link!} />,
          </>
        }
        disabled
      />
    ),
  };
  const tabsToRender = isProfessional
    ? [
        tabPanes.basicInfo,
        isManageGigsEnabled && is_gig_professional ? tabPanes.myGigs : null,
        tabPanes.contact,
        tabPanes.myOrders,
        tabPanes.requestsWorksOn,
        tabPanes.addresses,
        tabPanes.images,
        tabPanes.videos,
        tabPanes.password,
        tabPanes.social,
        tabPanes.advanced,
        tabPanes.share_profile,
        isReferralFlagOn ? tabPanes.referral : null,
      ]
    : [
        features[SERVICE_INQUIRY_FEATURE] ? tabPanes.serviceRequests : null,
        tabPanes.basicInfo,
        tabPanes.contact,
        tabPanes.social,
        tabPanes.password,
        tabPanes.advanced,
        tabPanes.myOrders,
        tabPanes.addresses,
        isReferralFlagOn ? tabPanes.referral : null,
      ];

  useEffect(() => {
    getClientData();
  }, []);

  const onTabSelect = (tabId: string) => {
    setSuccessMessage(false);
    setActiveTabId(activeTabId);
    setIsProfileMenuOpen(false);
    setSelectedItemId(tabId);
    if (tabId === TabId.MY_GIGS) {
      analytics.PublishEvent(new analytics.AnalyticsInitiateAddGigEvent());
    }
    history.push({
      pathname: `${PROFILE_ROUTE}/${tabId}`,
    });
  };

  const profileMobileTabsProf = [
    {
      id: TabId.SERVICE_REQUESTS,
      icon:
        activeTabId === TabId.SERVICE_REQUESTS
          ? profileSideMenuIcons.manageRequestsActive
          : profileSideMenuIcons.manageRequestsInActive,
      title: t(SERVICE_REQUESTS),
    },
    {
      id: TabId.MY_GIGS,
      icon:
        activeTabId === TabId.MY_GIGS ? profileSideMenuIcons.manageGigsActive : profileSideMenuIcons.manageGigsInActive,
      title: t(MANAGE_GIGS),
    },
    {
      id: TabId.PROFILE_INFO,
      icon: activeTabId === TabId.PROFILE_INFO ? profileSideMenuIcons.editActive : profileSideMenuIcons.editInActive,
      title: i18n.language === AR ? t(MY_ACCOUNT) : t(ACCOUNT),
    },
  ];

  const profileMobileTabsClient = [
    {
      id: TabId.SERVICE_REQUESTS,
      icon:
        activeTabId === TabId.SERVICE_REQUESTS
          ? profileSideMenuIcons.manageRequestsActive
          : profileSideMenuIcons.manageRequestsInActive,
      title: t(SERVICE_REQUESTS),
    },
    {
      id: TabId.PROFILE_INFO,
      icon: activeTabId === TabId.PROFILE_INFO ? profileSideMenuIcons.editActive : profileSideMenuIcons.editInActive,
      title: i18n.language === AR ? t(MY_ACCOUNT) : t(ACCOUNT),
    },
  ];
  const profileMobileTabs = isProfessional ? profileMobileTabsProf : profileMobileTabsClient;

  const isMyGigsPath = location?.pathname.includes(TabId.MY_GIGS);

  return (
    <Row className={`edit-profile ${isProfessional ? 'professional' : ''}`} justify="center">
      {isMobileView ? (
        <>
          <div className="profile-mobile-header">
            <div className="wrapper-mobile-header">
              {profileMobileTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`mobile-header-tab ${selectedItemId === tab.id ? 'selected-tab' : ''}`}
                  onClick={() => onTabSelect(tab.id)}
                >
                  <img src={tab.icon} alt={tab.title} />
                  <span className="tab-title-mobile-header">{tab.title}</span>
                </div>
              ))}

              <div onClick={toggleSidebar}>
                <img
                  src={isProfileMenuOpen ? icons.profileInfo.header_mobile_close : icons.profileInfo.header_mobile_menu}
                  alt=""
                />
              </div>
            </div>
          </div>
          <ProfileSidebar
            showSidebar={isProfileMenuOpen}
            setShowSidebar={setIsProfileMenuOpen}
            onUserIconClick={onHandleClick}
            profileMainMenuList={profileMainMenuList}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        </>
      ) : null}

      <MetaTags title={`${t(MANZILIK)} | ${t(PROFILE_INFORMATION)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <Col span={21}>
        {isMyGigsPath &&
        !isProfessionalCompleteProfile &&
        userState?.isAuthenticated &&
        userState?.client?.type === PROFESSIONAL ? (
          <div
            style={{
              marginTop: isMobileView ? '60px' : '0px',
            }}
          >
            <InDismissibleAlert
              isBlocked
              onMessageClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
              actionBtnClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
            />
          </div>
        ) : null}
        <ProfileHeader client={client!} onHandleClick={onHandleClick} fromProfile={true} />
        <Tabs
          activeKey={activeTabId}
          tabPosition={getTabPosition()}
          onTabClick={onTabSelect}
          className={`tabs ${getLayoutDirection(i18n.language)}`}
        >
          {tabsToRender}
        </Tabs>
      </Col>
    </Row>
  );
};

export default withUserAuthenticator(EditProfile);
