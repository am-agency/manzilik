import { Button, Col, Row } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import icons from '../../../../../assets/icons';
import { CONTINUE_WITH_FACEBOOK, CONTINUE_WITH_GOOGLE } from '../../../../../locales/strings';

interface Props {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
}
export const SocialMediaLogin: FunctionComponent<Props> = ({ onGoogleClick, onFacebookClick }: Props) => {
  const { t } = useTranslation();

  return (
    <Col span={24}>
      <Row gutter={14} justify="space-between">
        <Col xl={24} lg={24} md={24}>
          <Button
            type="primary"
            className="social-btn google"
            onClick={onGoogleClick}
            icon={<img className="social-btn-icon" src={icons.google_colored} />}
          >
            {t(CONTINUE_WITH_GOOGLE)}
          </Button>
        </Col>
      </Row>
    </Col>
  );
};
