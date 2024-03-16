import React from 'react';
import { Button, Col, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { AR, EN } from '../../../../../locales/constants';
import { LOGIN_BY_SOCIAL_MEDIA, LOGIN_WITH_GOOGLE } from '../../../../../locales/strings';
import icons from '../../../../../assets/icons';

interface Props {
  onFacebookLoginHandler: () => void;
  onGoogleLoginHandler: () => void;
}

export const SocialMediaLogin = ({ onGoogleLoginHandler, onFacebookLoginHandler }: Props) => {
  const { i18n, t } = useTranslation();

  return (
    <Col
      xl={{ span: 9, order: 3 }}
      lg={{ span: 10, order: 3 }}
      md={{ span: 24, order: 3 }}
      sm={{ span: 24, order: 1 }}
      xs={{ span: 24, order: 1 }}
      className="social-login"
    >
      <h6 className="col-heading">{t(LOGIN_BY_SOCIAL_MEDIA)}</h6>

      <Button
        type="primary"
        className={`social-btn google ${i18n.language === AR ? AR : EN}`}
        icon={
          <>
            <img src={icons.google_colored} className="social-btn-icon" />
            <Divider type="vertical" />
          </>
        }
        onClick={onGoogleLoginHandler}
      >
        {t(LOGIN_WITH_GOOGLE)}
      </Button>
    </Col>
  );
};
