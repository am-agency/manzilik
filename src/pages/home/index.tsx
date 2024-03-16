import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';

// hook
import { useMainContext } from '../../app/providers/main';
// Components
import { Row, Col, Typography, Select, Divider, Button } from 'antd';
import SignupWelcome from './components/signup_welcome';
import UserBox from './components/user_box';
import { ProjectListWrapper } from './components/wrappers';
import ProjectsListWithPagination from './components/projects_list';
import { HomePageFooter } from '../../components/footer/home_page_footer';
import { NotLoggedInHomePage } from './not_logged_in_home_page';
import { MetaTags } from '../../components/meta_tags';
import {
  COMPLETE_BTN,
  EXPLORE_YOUR_REQUESTS,
  HOME,
  HOME_PAGE_SEO_DESCRIPTION,
  INCOMPLETE_RFQ,
  LATEST,
  MANZILIK,
  PROFESSIONAL,
  REQUESTS_WORKS_ON,
  SORT_BY,
} from '../../locales/strings';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../app/layouts';
import i18n from '../../app/i18n';
import { sortData } from '../ideas/utils';
import { MANZILIK_AI_FLOW, NEWEST, REQUEST_FOR_QUOTATION, SHOW_TUTORIAL_ADD_GIGS } from '../../app/settings';
import * as analytics from '../../analytics';
import { useSendBirdContext } from '../../context/sendbird_context';
import InDismissibleAlert from '../../components/in_dismissible_alert';
import { useClient } from '../../app/hooks/use_client';
import { useCompletePersonalProfile } from '../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import { CompleteProfileContext } from '../../context/complete_profile_context';
import { useFeature, useFeatures } from 'flagged';
import { useHistory } from 'react-router-dom';
import BannerContainer from '../../components/banner_container';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';
import Loader from 'react-spinners/ClipLoader';
import { BannerSlug } from '../../constants';
import RfqCard from '../requests_for_quotations/components/rfq_card';
import { UserRole } from '../../app/types';
import { GigsTutorialModal } from '../../components/gigs_tutorial_modal';
import headerImage from '../../assets/backgrounds/heading_bg.png';
import { footerIcons } from '../../assets/icons/footer';
import BannerCard from '../../components/banner_card';
import { COMPLETE_PROFILE_ROUTE } from '../../utils/routes';

const Home: FunctionComponent = () => {
  const { userState } = useMainContext();
  const { t } = useTranslation();
  const [sortedValue, setSortedValue] = useState<string>();
  const { setAccessToken, setUserId } = useSendBirdContext();
  const { isProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    isProfessionalCompleteProfile: boolean;
    getProfessional: () => void;
  };
  const { banner, isBannerLoading, setBannerSlug, isProfessional } = useContext(
    SharedStateContext
  ) as SharedStateInterface;

  useEffect(() => {
    setBannerSlug!(BannerSlug.MAGAZINE_BANNER);
  }, []);

  const features = useFeatures();
  const history = useHistory();
  const isClient = !isProfessional && userState?.isAuthenticated;
  const isGuest = !userState?.isAuthenticated;

  const isRfqFlag = features[REQUEST_FOR_QUOTATION];
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const isTutorialFeatureEnabled = useFeature(SHOW_TUTORIAL_ADD_GIGS);

  useEffect(() => {
    // Check if the flag 'hasShownBanner' is not set in localStorage
    if (!localStorage.getItem('hasShownBanner') && isProfessional) {
      // Set the flag in localStorage to prevent showing the banner again
      localStorage.setItem('hasShownBanner', 'true');
      analytics.PublishEvent(new analytics.AnalyticsViewAddGigTutorialEvent());
    }
  }, []);

  const firstTimeRender = JSON.parse(localStorage.getItem('hasShownBanner')!) && isTutorialFeatureEnabled;

  const { initClient, hasDraftRfq } = useClient();

  useEffect(() => {
    if (userState?.isAuthenticated && userState?.client?.type === PROFESSIONAL) {
      initClient();
    }
  }, [userState?.isAuthenticated]);

  const onSortchange = (value: string) => {
    setSortedValue(value);
  };
  useEffect(() => {
    if (userState.client) {
      setUserId(userState.client.id);
      setAccessToken(userState.client.sendbird_access_token!);
      localStorage.setItem('sendbird_access_token', userState.client.sendbird_access_token!);
      localStorage.setItem('sendbird_user_id', userState.client.id);
    }
  }, [userState.client]);

  return (
    <>
      <GigsTutorialModal
        isModalVisible={isModalVisible && firstTimeRender && isProfessional}
        setIsModalVisible={setIsModalVisible}
      />
      {hasDraftRfq && (
        <InDismissibleAlert
          message={t(INCOMPLETE_RFQ)}
          onMessageClick={() => {
            history.push('/request-quotation-service');
          }}
          actionBtnText={t(COMPLETE_BTN)}
          actionBtnClick={() => {
            history.push('/request-quotation-service');
          }}
        />
      )}
      {userState.isAuthenticated && !isProfessionalCompleteProfile && userState?.client?.type === PROFESSIONAL ? (
        <InDismissibleAlert
          onMessageClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
          actionBtnClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
        />
      ) : null}

      <MetaTags title={`${t(MANZILIK)} | ${t(HOME)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <Row justify="center">
        <Col
          span={20}
          className="logged-in-home-container"
          style={{
            backgroundImage: isGuest ? `url(${headerImage})` : 'none',
            height: isGuest ? '650px' : 'auto',
          }}
        >
          <SignupWelcome />
        </Col>
        {isRfqFlag && !isProfessional ? (
          <Col span={24}>
            <RfqCard />
          </Col>
        ) : null}

        {features[MANZILIK_AI_FLOW] && (
          <Col span={20}>
            {isBannerLoading ? (
              <div className="loader-banner">
                <Loader />
              </div>
            ) : (
              <BannerContainer>
                <BannerCard banner={banner} isDynamicContent />
              </BannerContainer>
            )}
          </Col>
        )}
      </Row>
      <NotLoggedInHomePage />
    </>
  );
};

export default Home;
