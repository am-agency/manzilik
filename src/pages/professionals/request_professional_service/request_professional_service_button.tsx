import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Feature } from 'flagged';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18n from '../../../app/i18n';
import { SERVICE_INQUIRY_FEATURE } from '../../../app/settings';
import { SEND_SERVICE_REQUEST } from '../../../locales/strings';
import { getRequestServiceUrl } from './request_professional_service_view';

interface Props {
  professionalId: string;
  variant?: 'secondary';
}

export const RequestProfessionalServiceButton = ({ professionalId, variant }: Props) => {
  const { t } = useTranslation();
  const url = useMemo(() => getRequestServiceUrl(professionalId), [professionalId]);
  return (
    <Feature name={SERVICE_INQUIRY_FEATURE}>
      {(isEnabled) =>
        isEnabled ? (
          <Link to={url}>
            <Button
              icon={i18n.language === 'ar' ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
              className={`request-button ${variant ? variant : ''}`}
            >
              {t(SEND_SERVICE_REQUEST)}
            </Button>
          </Link>
        ) : null
      }
    </Feature>
  );
};
