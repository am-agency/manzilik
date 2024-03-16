import React, { FunctionComponent, useContext, useState } from 'react';
// hook
import { useMainContext } from '../../app/providers/main';
// Components
import { Row, Col, Typography, Select, Divider, Button } from 'antd';
import { HomePageFooter } from '../../components/footer/home_page_footer';
import { MetaTags } from '../../components/meta_tags';
import {
  BROWSE_JOBS,
  BUSINESS_YOU_LIKE,
  HOME,
  HOME_PAGE_SEO_DESCRIPTION,
  MANZILIK,
  PROFESSIONAL,
} from '../../locales/strings';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../app/layouts';
import User_box from '../home/components/user_box';
import BoxShadowContainer from '../../components/box_shadow_container';
import ProfRfqCard from './components/prof_rfq_card';
import ManzilikDrawer from '../../components/manzilik_drawer';
import QuotationsDrawer from './components/quotations_drawer';
import QuotationsFilters from './components/quotations_filters';
import { RfqProvider } from './requests_for_quotations_context';
import { RfqList } from './components/rfq_list';
import InDismissibleAlert from '../../components/in_dismissible_alert';
import { CompleteProfileContext } from '../../context/complete_profile_context';
import { useMediaQuery } from 'react-responsive';
import { COMPLETE_PROFILE_ROUTE } from '../../utils/routes';
import { useHistory } from 'react-router-dom';

const RequestsForQuotations: FunctionComponent = () => {
  const { userState, requestApi } = useMainContext();
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { isProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    isProfessionalCompleteProfile: boolean;
  };
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <>
      <MetaTags title={`${t(MANZILIK)} | ${t(HOME)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      {userState.isAuthenticated && !isProfessionalCompleteProfile && userState?.client?.type === PROFESSIONAL ? (
        <InDismissibleAlert
          isBlocked
          onMessageClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
          actionBtnClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
        />
      ) : null}
      <RfqProvider>
        <Row justify="center">
          <Col span={20}>
            <div className="rfq-list-header">
              <p>{t(BUSINESS_YOU_LIKE)}</p>
              <p>{t(BROWSE_JOBS)}</p>
            </div>
          </Col>
        </Row>
        <Row className="rfq-list-container" justify="center">
          <Col span={20}>
            {/* For Handling different  layout in mobile  */}
            <Row justify="space-between">
              {isMobileView ? null : (
                <Col lg={7} xl={7} md={7} xs={24} sm={24}>
                  <User_box />
                  <HomePageFooter />
                </Col>
              )}

              <Col lg={16} xl={16} md={16} xs={24} sm={24}>
                <QuotationsFilters />

                <RfqList />
              </Col>
              {!isMobileView ? null : (
                <Col lg={7} xl={7} md={7} xs={24} sm={24}>
                  <User_box />
                  <HomePageFooter />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </RfqProvider>
    </>
  );
};

export default RequestsForQuotations;
