import { Col, Row } from 'antd';
import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../logo';
import { saveLanguageToStorage } from '../../utils';
import { useMainContext } from '../../app/providers/main';
import { LanguageSwitch } from '../language_switch';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { getLanguageFromURL } from './utils';
import { LandingMenuItems } from './landing_menue_items';
import { WHITE } from '../../pages/projects/constants';
import { footerIcons } from '../../assets/icons/footer';
import { FACEBOOK_URL, INESTEGRAM_URL, TWITTER_URL } from '../../app/settings';
import Separator from '../separator';
import { CLIENTS_LANDING_PAGE_ROUTE } from '../../utils/routes';
import { useHistory } from 'react-router';

const LandingHeader: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const { xs, sm } = useBreakpoint();
  const { userState } = useMainContext();
  const history = useHistory();
  const currentPage = history.location.pathname;
  const isClientsPage = currentPage === CLIENTS_LANDING_PAGE_ROUTE;

  const socialMedia = [
    { icon: isClientsPage ? footerIcons.instagram.iconWhite : footerIcons.instagram.iconBlue, link: INESTEGRAM_URL },
    { icon: isClientsPage ? footerIcons.twitter.iconWhite : footerIcons.twitter.iconBlue, link: TWITTER_URL },
    { icon: isClientsPage ? footerIcons.facebook.iconWhite : footerIcons.facebook.iconBlue, link: FACEBOOK_URL },
  ];

  const onLanguageChange = (lng: string) => {
    saveLanguageToStorage(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const lang = getLanguageFromURL(location.search);
    onLanguageChange(lang!);
  }, []);

  const isMobile = xs || sm;

  return (
    <Row
      justify="center"
      align="middle"
      className={`landing-page-header ${!isClientsPage ? 'landing-page-header-professionals' : ''}`}
    >
      <Col xl={20} lg={20} md={22} sm={22} xs={22}>
        <Row justify="space-between">
          <Col xl={20} lg={18} md={12} sm={12} xs={12}>
            <Row justify={!isMobile ? 'space-between' : userState.isAuthenticated ? 'space-between' : 'start'}>
              <Col xl={3} lg={3} md={6} xs={14} sm={14}>
                {isClientsPage ? <Logo color={WHITE} /> : <Logo />}
              </Col>
              <Col xl={20} lg={20} md={0} xs={0} sm={0}>
                <LandingMenuItems />
              </Col>
            </Row>
          </Col>
          <Col xl={4} lg={6} md={12} sm={12} xs={12}>
            <Row align={'middle'} justify={'end'}>
              {socialMedia.map((elm, index) => {
                return (
                  <a href={elm.link} target="_blank" rel="noreferrer" key={index} className="social-media-icons">
                    <img src={elm.icon} />
                  </a>
                );
              })}
              <Separator horizontal={4} />
              <LanguageSwitch onLanguageChange={onLanguageChange} />
            </Row>
          </Col>
          <Col xl={0} lg={0} md={24} xs={24} sm={24}>
            <Row justify="center">
              <Col xl={4} lg={6} md={18} sm={24} xs={24}>
                <LandingMenuItems />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LandingHeader;
