import React, { useMemo, useState } from 'react';
import { Button, Modal, Space, Typography } from 'antd';
import SuccessIcon from '../../../assets/images/Frame.svg';
import FailIcon from '../../../assets/images/Failed.svg';
import {
  CONNECT_WITH_SERVICE_PROVIDER,
  PRICE_QUOTE_DETAILS,
  PRICE_QUOTE_SEND_SUCCESS,
  PRICE_QUOTE_SEND_SUCCESS_TEXT,
  RETRY_AGAIN,
  SERVICE_REQUESTS_LIST,
  SERVICE_REQUEST_ERROR,
  SERVICE_REQUEST_UNDER_REVIEW,
  SERVICE_REQUEST_WAS_SENT,
  SOMETHING_WENT_WRONG,
} from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE } from '../../../utils/routes';
import Separator from '../../../components/separator';
import MessageIcon from '../../../icons/message_icon';
import { useSendBirdContext } from '../../../context/sendbird_context';
import { useMainContext } from '../../../app/providers/main';
import { createSendBirdChatGroup } from '../../messenger/api';
import { CreateSendBirdChatGroupApi } from '../../messenger/types';
import * as analytics from '../../../analytics';
import { useFeatures } from 'flagged';
import { SERVICE_CHAT } from '../../../app/settings';

export enum SubmitServiceRequestStatus {
  NO_SENT,
  SUCCESS,
  FAILED,
}

interface Props {
  status: SubmitServiceRequestStatus;
  retry: () => void;
  onClose: () => void;
  requestId?: string;
}

export const RequestQuotationFeedback = ({ status, retry, onClose, requestId }: Props) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { setAccessToken } = useSendBirdContext();
  const { requestApi } = useMainContext();
  const features = useFeatures();

  const success = useMemo(() => status === SubmitServiceRequestStatus.SUCCESS, [status]);

  const dismiss = () => {
    if (success) {
      history.push(`${PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE}/${requestId}`);
    } else {
      retry();
    }
  };

  return status !== SubmitServiceRequestStatus.NO_SENT ? (
    <Modal visible footer={null} width={350} closable={false}>
      <section className={`service-request-feedback ${i18n.language === 'ar' ? 'rtl' : ''}`}>
        <button className="modal-x" onClick={onClose}>
          ×
        </button>
        <img src={success ? SuccessIcon : FailIcon} alt="" />
        <Space direction="vertical" size="large">
          <Typography.Title className="title">
            {t(success ? PRICE_QUOTE_SEND_SUCCESS : SOMETHING_WENT_WRONG)}
          </Typography.Title>
          <p> {t(success ? PRICE_QUOTE_SEND_SUCCESS_TEXT : SERVICE_REQUEST_ERROR)} </p>

          <Button type="primary" onClick={dismiss} block>
            {t(success ? PRICE_QUOTE_DETAILS : RETRY_AGAIN)}
          </Button>
        </Space>
      </section>
    </Modal>
  ) : null;
};
