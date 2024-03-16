import React from 'react';
import { Col, Row } from 'antd';
import Logo from '../logo';

import {
  FOOTER_CREDITS,
  COMPANY,
  ABOUT_MANZEL,
  PRIVACY_AND_POLICY,
  TERMS_AND_CONDITIONS,
  COOKIE_POLICY,
  GET_HELP,
  GET_INSPIRED,
  MANZEL_SUPPORT,
  CONTACT,
  DOWNLOAD_APPLICATION,
  FOLLOW_US,
} from '../../locales/strings';
import { useTranslation } from 'react-i18next';
import { AR, COOKIE_POLICY_SECTION, EN } from '../../locales/constants';
import { footerIcons } from '../../assets/icons/footer';
import Separator from '../separator';
import { AppleButton, GooglePlayButton } from './apps_button';
import { FACEBOOK_URL, TWITTER_URL, INESTEGRAM_URL } from '../../app/settings';
import { Link } from 'react-router-dom';
import { CONTACT_US_ROUT, PRIVACY_POLICY, TERMS_AND_CONDITIONS_ROUTE, WHO_WE_ARE_ROUTE } from '../../utils/routes';
import { useHistory } from 'react-router';
import icons from '../../assets/icons';

export const socialMedia = [
  { icon: footerIcons.facebookBlack.icon, link: FACEBOOK_URL },
  { icon: footerIcons.xBlack.icon, link: TWITTER_URL },
  { icon: footerIcons.instagramBlack.icon, link: INESTEGRAM_URL },
  // @TODO: will hide them for now
  // { icon: footerIcons.youtube.icon },
  // { icon: footerIcons.rss.icon },
];

const Footer = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  return (
    <Row className="footer" justify="center">
      <Col span={20}>
        <Row>
          <Col xl={6} lg={6} md={12} sm={24} xs={24} className="logo col-sperator">
            <img src={icons.logo} alt="logo" />
            <h4 className="credit">{t(FOOTER_CREDITS)}</h4>
            <img src={footerIcons.couch.icon} alt="counch" className="counch-img" />
          </Col>
          <Col xl={6} lg={6} md={12} sm={24} xs={24} className="col-sperator">
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
              <div onClick={() => history.push(`${PRIVACY_POLICY}#${COOKIE_POLICY_SECTION}`)}>{t(COOKIE_POLICY)}</div>
            </p>
          </Col>
          <Col xl={6} lg={24} md={6} sm={24} xs={24} className="col-sperator">
            <h4>{t(GET_HELP)}</h4>
            {/* <p>{t(MANZEL_SUPPORT)}</p> */}
            <p>
              <Link to={CONTACT_US_ROUT}>{t(CONTACT)}</Link>
            </p>
          </Col>
          <Col
            xl={6}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            className={`col-sperator social-apps ${i18n.language === AR ? AR : EN}`}
          >
            <h4>{t(DOWNLOAD_APPLICATION)}</h4>
            <Row className="apps" gutter={8}>
              <Col span={12}>
                <AppleButton />
              </Col>
              <Col span={12}>
                <GooglePlayButton />
              </Col>
            </Row>
            <Separator vertical={24} />
            <h4>{t(FOLLOW_US)}</h4>
            <Row className="social-media">
              {socialMedia.map((elm, index) => {
                return (
                  <a href={elm.link} target="_blank" rel="noreferrer" key={index}>
                    <p>
                      <img src={elm.icon} />
                    </p>
                    {/* <Separator horizontal={22} /> */}
                  </a>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Footer;
