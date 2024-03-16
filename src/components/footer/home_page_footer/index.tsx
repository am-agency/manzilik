import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { socialMedia } from '..';
import {
  ABOUT_MANZEL,
  ALL_RIGHTS,
  COMPANY,
  CONTACT,
  COOKIE_POLICY,
  GET_HELP,
  MANZEL_SUPPORT,
  MANZILIK,
  TERMS_AND_CONDITIONS,
  PRIVACY_AND_POLICY,
  FOLLOW_US,
} from '../../../locales/strings';
import Separator from '../../separator';
import { AppleButton, GooglePlayButton } from '../apps_button';
import { Link } from 'react-router-dom';
import { CONTACT_US_ROUT, PRIVACY_POLICY, TERMS_AND_CONDITIONS_ROUTE, WHO_WE_ARE_ROUTE } from '../../../utils/routes';
import { footerIcons } from '../../../assets/icons/footer';
import { APPLE_APP_LINK, GOOGLE_PLAY_APP_LINK } from '../../../app/settings';

export const HomePageFooter = () => {
  const { t } = useTranslation();

  return (
    <Row className="footer home-page-footer">
      <Col xl={10} lg={10} md={24} sm={24} xs={24}>
        <h4>{t(COMPANY)}</h4>
        <p>
          <Link to={WHO_WE_ARE_ROUTE}>{t(ABOUT_MANZEL)}</Link>
        </p>
        <p>
          <Link to={PRIVACY_POLICY}>{t(PRIVACY_AND_POLICY)}</Link>
        </p>
        <p>
          <Link to={TERMS_AND_CONDITIONS_ROUTE}>{t(TERMS_AND_CONDITIONS)}</Link>
        </p>
        <p>
          <Link to={PRIVACY_POLICY}>{t(COOKIE_POLICY)}</Link>
        </p>
      </Col>
      <Col xl={14} lg={14} md={24} sm={24} xs={24} className="social-apps">
        <h4>{t(GET_HELP)}</h4>
        {/* <p>{t(MANZEL_SUPPORT)}</p> */}
        <p>
          <Link to={CONTACT_US_ROUT}>{t(CONTACT)}</Link>
        </p>

        <Separator vertical={5} />
        <div className="apps">
          <a href={APPLE_APP_LINK} target="_blank" rel="noreferrer">
            <img src={footerIcons.apple2.icon} alt="app store" />
          </a>
          <a href={GOOGLE_PLAY_APP_LINK} target="_blank" rel="noreferrer">
            <img src={footerIcons.google.icon} alt="play store" />
          </a>
        </div>
        <Separator vertical={10} />
        <Row className="social-media">
          {socialMedia.map((elm, index) => {
            return (
              <a href={elm.link} target="_blank" rel="noreferrer" key={index}>
                <p>
                  <img src={elm.icon} />
                </p>
              </a>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
};
