import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Professional } from '../../API';
import { useModal } from '../../app/providers/modal';
import icons from '../../assets/icons';
import { REQUEST_SERVICE_NOW } from '../../locales/strings';
import { getRequestServiceUrl } from '../../pages/professionals/request_professional_service/request_professional_service_view';

import { Feature } from 'flagged';
import { SERVICE_INQUIRY_FEATURE } from '../../app/settings';
interface Props {
  item: Professional | undefined;
  width?: string;
  padding?: string;
  backgroundImage?: string;
  isDisabled?: boolean;
}
function SendRequestButton(props: Props) {
  const { item, width, padding, backgroundImage, isDisabled } = props;
  const { showModal } = useModal();
  const url = useMemo(() => getRequestServiceUrl(item?.id!), [item?.id]);
  const history = useHistory();

  const onSendRequest = () => {
    history.push(url);
  };

  const { t } = useTranslation();
  return (
    <Feature name={SERVICE_INQUIRY_FEATURE}>
      {(isEnabled) =>
        isEnabled ? (
          <div
            className="send-request"
            onClick={onSendRequest}
            style={{
              width: width || 'auto',
              padding: padding || '7px 15.5px',
              backgroundImage: backgroundImage || '',
              pointerEvents: isDisabled ? 'none' : 'auto',
            }}
          >
            <p>{t(REQUEST_SERVICE_NOW)}</p>
            <img src={icons.prof_arrow_white} width="24" height="24" alt="arrow" />
          </div>
        ) : null
      }
    </Feature>
  );
}

export default SendRequestButton;
