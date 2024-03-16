import { Button, Col, Row, Space, Table, Typography } from 'antd';
import React, { PropsWithChildren, ReactElement, useEffect, useMemo, useState } from 'react';

import {
  ACCEPT_REQUEST,
  ADDITIONAL_INFO,
  BUDGET,
  CANCEL,
  CANCEL_REQUEST,
  CATEGORIES,
  COMPLETED_REQUEST,
  CONTACT_DETAILS,
  EXTRA_INFO,
  HOMEOWNER,
  IMAGES,
  ISSUE_DATE,
  LOADING,
  PHONE_NUMBER,
  REJECT,
  REQUEST_ACCEPTED_CONTACT_OWNER,
  REQUEST_COMPLETED,
  REQUEST_DETAILS,
  REQUEST_NUMBER,
  REQUEST_STATUS,
  SAR,
  SERVICE_DESCRIPTION,
  SERVICE_PRICE,
  SERVICE_TYPE,
  WHATSAPP_NUMBER,
} from '../../../../locales/strings';
import { useServiceRequestTable } from './hooks/useServiceRequestTable';
import { useServiceRequestDetails } from './hooks/useServiceRequestDetails';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../components/loading';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AR } from '../../../../locales/constants';
import { useServiceRequestActions } from './hooks/useServiceRequestActions';
import { ServiceInquiryStatus } from '../../../professionals/request_professional_service/types';
import { ServiceRequestRejectForm } from './service_request_reject_form';
import { DateFormat } from '../../../../components/date_format';
import { useMediaQuery } from 'react-responsive';
import { ServiceInquiryRejectForm } from './service_inquery_reject_form';
import { useLocation } from 'react-router-dom';
import { useFeatures } from 'flagged';
import { SERVICE_COMPLETED_FLOW } from '../../../../app/settings';
import { useClient } from '../../../../app/hooks/use_client';

import i18n from '../../../../app/i18n';
import icons from '../../../../assets/icons';
import Separator from '../../../../components/separator';
import Loader from 'react-spinners/ClipLoader';
import StartChatButton from '../../../../components/custom_button';
import MessageIcon from '../../../../icons/message_icon';
import * as analytics from '../../../../analytics';

interface Props {
  serviceRequestId: string;
  isProfessional: boolean;
  reloadList: () => void;
}

const Title = (props: PropsWithChildren<unknown>) => <Typography.Title level={4}>{props.children}</Typography.Title>;

interface RecordProps {
  label: string;
  value?: string;
  vertical?: boolean;
  format?: (value: RecordProps['value']) => ReactElement;
}

const toastResetTimeout = 3000;

export const Record = ({ label, value, vertical, format }: RecordProps) =>
  value ? (
    <Row className={`record ${vertical ? 'vertical' : ''}`}>
      <Col lg={12} xl={12} md={12} sm={11} xs={10}>
        <Typography.Text strong>{label}</Typography.Text>
      </Col>
      <Col
        className="word-wrap"
        lg={vertical ? 24 : 12}
        xl={vertical ? 24 : 12}
        md={vertical ? 24 : 12}
        sm={13}
        xs={14}
      >
        {format ? format(value) : value}
      </Col>
    </Row>
  ) : null;

enum LOADING_STATE {
  INIT,
  PENDING_ACCEPT,
  PENDING_REJECT,
}

const QuotationsDetails = ({ serviceRequestId, isProfessional, reloadList }: Props) => {
  const { t } = useTranslation();
  const { loadServiceRequestDetails, serviceRequestDetails, setRequestStatus, isServiceRequestDetailsLoading } =
    useServiceRequestDetails();
  const table = useServiceRequestTable();
  const { acceptServiceRequest, completedServiceRequest } = useServiceRequestActions();
  const [actionLoading, setActionLoading] = useState<LOADING_STATE>(LOADING_STATE.INIT);
  const [isCompletedLoading, setIsCompletedLoading] = useState(false);
  const [showConfirmAcceptToast, setShowConfirmAcceptToast] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showInquiryRejectionForm, setShowInquiryRejectionForm] = useState(false);
  const [modalType, setModalType] = useState('');
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });
  const { client } = useClient();
  const features = useFeatures();
  const location = useLocation();
  const { search } = location;

  useEffect(() => {
    if (serviceRequestId) {
      loadServiceRequestDetails(serviceRequestId);
    }
  }, [serviceRequestId]);

  useEffect(() => {
    if (serviceRequestDetails) {
      table.setData([serviceRequestDetails]);
    }
  }, [serviceRequestDetails]);

  const Arrow = useMemo(() => {
    return i18n.language === AR ? () => <LeftOutlined /> : () => <RightOutlined />;
  }, [i18n.language]);

  const onAcceptServiceRequest = async () => {
    setActionLoading(LOADING_STATE.PENDING_ACCEPT);
    if (serviceRequestDetails?.id) {
      try {
        await acceptServiceRequest(serviceRequestDetails.id);
        setRequestStatus(ServiceInquiryStatus.ACCEPTED);
        setShowConfirmAcceptToast(true);
        setTimeout(() => {
          setShowConfirmAcceptToast(false);
        }, toastResetTimeout);
      } catch (error) {}
    }
    setActionLoading(LOADING_STATE.INIT);
  };

  const onCompleteRejection = () => {
    setShowRejectionForm(false);
    setRequestStatus(ServiceInquiryStatus.REJECTED);
  };

  const onDismiss = () => {
    setShowRejectionForm(false);
  };
  const HandleToggleInquiryRejectionForm = () => {
    setShowInquiryRejectionForm(!showInquiryRejectionForm);
  };
  const onCompleteServiceRequest = async () => {
    setIsCompletedLoading(true);
    try {
      await completedServiceRequest(serviceRequestDetails?.id!, client?.id!);
      analytics.PublishEvent(new analytics.AnalyticsCompleteService(client?.id!));
      setModalType('completed');
      setShowInquiryRejectionForm(!showInquiryRejectionForm);
      setIsCompletedLoading(false);
    } catch (error) {
      setIsCompletedLoading(false);
    }
  };

  const onWhatsappNav = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    analytics.PublishEvent(new analytics.AnalyticsContactClient('whatsapp'));
  };

  const onPhoneNav = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    analytics.PublishEvent(new analytics.AnalyticsContactClient('call'));
  };

  const isReceivedRequest = search.includes('isReceivedRequest');

  return (
    <section className="service-request-details">
      <Separator vertical={20} />
      <Title>{t(REQUEST_DETAILS)}</Title>
    </section>
  );
};

export default QuotationsDetails;
