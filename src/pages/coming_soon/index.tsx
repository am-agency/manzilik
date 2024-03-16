import React, { FunctionComponent } from 'react';
import { Row } from 'antd';
import i18n from '../../app/i18n';
import { comingSoonIcons } from '../../assets/icons/landing-pages/coming_soon';
import { Container } from '../../components/container';
import Separator from '../../components/separator';
import { AR } from '../../locales/constants';
import { ComingSoonForm } from './components/coming_soon_form';
import featureBg from '../../assets/backgrounds/professionals_landing_page_bg.png';
import featureBgEn from '../../assets/backgrounds/professionals_landing_page_en.svg';
import comingSoonCouch from '../../assets/backgrounds/coming_soon_couch.png';
import comingSoonCouchMobile from '../../assets/backgrounds/coming_soon_mobile.png';
import { useTranslation } from 'react-i18next';
import { COMING_SOON, MANZILIK_STORE_SOON, WE_HELP_PEOPLE_TO_ACHEVE_THEIR_GOAL } from '../../locales/strings';
import { footerIcons } from '../../assets/icons/footer';
import { FACEBOOK_URL, INESTEGRAM_URL, TWITTER_URL } from '../../app/settings';

const ComingSoon: FunctionComponent = () => {
  const { t } = useTranslation();
  const isArabic = i18n.language == AR;
  const featuresBgImage = isArabic ? featureBg : featureBgEn;
  const isMobile = window.innerWidth < 500;

  const socialMedia = [
    { icon: footerIcons.instagram.iconWhite, link: INESTEGRAM_URL },
    { icon: footerIcons.twitter.iconWhite, link: TWITTER_URL },
    { icon: footerIcons.facebook.iconWhite, link: FACEBOOK_URL },
  ];

  return (
    <div className="coming-soon">
      <Container>
        <Row justify="center">
          <div className={`right-message-container message-container ${i18n.language}`}>
            <div className="message-img">
              <img src={comingSoonIcons.blueMessage} alt="message" />
            </div>
          </div>
          <div className="coming-soon-header-container">
            <div className="coming-soon-signature"> {t(COMING_SOON)} </div>
            <div className="coming-soon_title"> {t(MANZILIK_STORE_SOON)} </div>
            <p className="coming-soon_description"> {t(WE_HELP_PEOPLE_TO_ACHEVE_THEIR_GOAL)} </p>
          </div>
          <div className={`left-message-container message-container ${i18n.language}`}>
            <div className="message-img">
              <img src={comingSoonIcons.goldEdit} alt="message" />
            </div>
          </div>
        </Row>
        <Separator vertical={13} />
        <Row justify="center" className="coming-soon-body">
          {!isMobile && (
            <div className={`right-body-message right-message-container message-container ${i18n.language}`}>
              <div className="message-img">
                <img src={comingSoonIcons.home} alt="message" />
              </div>
            </div>
          )}
          <ComingSoonForm />
          {!isMobile && (
            <div className={`left-body-message left-message-container message-container ${i18n.language}`}>
              <div className="message-img">
                <img src={comingSoonIcons.shop} alt="message" />
              </div>
            </div>
          )}
        </Row>
      </Container>
      {!isMobile && <Separator vertical={70} />}
      <Row
        justify="center"
        className="features"
        gutter={[0, 50]}
        style={{ backgroundImage: `url(${featuresBgImage})` }}
      >
        <img
          src={isMobile ? comingSoonCouchMobile : comingSoonCouch}
          alt="coming-soon-couch"
          className="img-fit-content"
        />
        <Row align={'middle'} justify={'center'} className="social-media-container">
          {socialMedia.map((elm, index) => {
            return (
              <>
                <a href={elm.link} target="_blank" rel="noreferrer" key={index} className="social-media-icons">
                  <img src={elm.icon} />
                </a>
                <Separator horizontal={15} />
              </>
            );
          })}
        </Row>
      </Row>
    </div>
  );
};

export default ComingSoon;
