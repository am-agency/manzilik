import { Button, Col, Row, Typography } from 'antd';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { LOADING_STATE, Record } from '../../service_request_details';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
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
  IMAGES,
  ISSUE_DATE,
  PHONE_NUMBER,
  REJECT,
  REQUEST_COMPLETED,
  SERVICE_DESCRIPTION,
  WHATSAPP_NUMBER,
} from '../../../../../../locales/strings';
import {
  ServiceInquiryDetails,
  ServiceInquiryStatus,
} from '../../../../../professionals/request_professional_service/types';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AR } from '../../../../../../locales/constants';
import * as analytics from '../../../../../../analytics';
import icons from '../../../../../../assets/icons';
import Separator from '../../../../../../components/separator';
import { DateFormat } from '../../../../../../components/date_format';
import { useLocation } from 'react-router-dom';
import { useServiceRequestActions } from '../../hooks/useServiceRequestActions';
import { useServiceRequestDetails } from '../../hooks/useServiceRequestDetails';
import { SERVICE_COMPLETED_FLOW } from '../../../../../../app/settings';
import { useFeatures } from 'flagged';
import { useClient } from '../../../../../../app/hooks/use_client';
import StartChatButton from '../../../../../../components/custom_button';
import MessageIcon from '../../../../../../icons/message_icon';
import { ServiceRequestRejectForm } from '../../service_request_reject_form';
import { ServiceInquiryRejectForm } from '../../service_inquery_reject_form';
import { ServiceInquiry, ServiceInquiryPhoto } from '../../../../../../API';

interface ServiceRequestContentProps {
  serviceRequestDetails: ServiceInquiry;
  isProfessional: boolean;
  reloadList: () => void;
  showConfirmAcceptToast?: boolean;
  setShowConfirmAcceptToast?: (value: boolean) => void;
}

const ServiceRequestContent = (props: ServiceRequestContentProps) => {
  const { serviceRequestDetails, isProfessional, reloadList, showConfirmAcceptToast, setShowConfirmAcceptToast } =
    props;
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<LOADING_STATE>(LOADING_STATE.INIT);
  const [isCompletedLoading, setIsCompletedLoading] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showInquiryRejectionForm, setShowInquiryRejectionForm] = useState(false);

  const { acceptServiceRequest, completedServiceRequest } = useServiceRequestActions();
  const { setRequestStatus } = useServiceRequestDetails();
  const { t, i18n } = useTranslation();
  const toastResetTimeout = 3000;
  const features = useFeatures();
  const { client } = useClient();

  const location = useLocation();
  const { search } = location;
  const isReceivedRequest = search.includes('isReceivedRequest');

  const Arrow = useMemo(() => {
    return i18n.language === AR ? () => <LeftOutlined /> : () => <RightOutlined />;
  }, [i18n.language]);
  const Title = (props: PropsWithChildren<unknown>) => <Typography.Title level={4}>{props.children}</Typography.Title>;
  const HandleToggleInquiryRejectionForm = () => {
    setShowInquiryRejectionForm(!showInquiryRejectionForm);
  };
  const onDismiss = () => {
    setShowRejectionForm(false);
  };
  const onCompleteRejection = () => {
    setShowRejectionForm(false);
    setRequestStatus(ServiceInquiryStatus.REJECTED);
  };
  const onWhatsappNav = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    analytics.PublishEvent(new analytics.AnalyticsContactClient('whatsapp'));
  };
  const onPhoneNav = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    analytics.PublishEvent(new analytics.AnalyticsContactClient('call'));
  };
  const onAcceptServiceRequest = async () => {
    setActionLoading(LOADING_STATE.PENDING_ACCEPT);
    if (serviceRequestDetails?.id) {
      try {
        await acceptServiceRequest(serviceRequestDetails.id);
        setRequestStatus(ServiceInquiryStatus.ACCEPTED);
        setShowConfirmAcceptToast!(true);
        setTimeout(() => {
          setShowConfirmAcceptToast!(false);
        }, toastResetTimeout);
      } catch (error) {}
    }
    setActionLoading(LOADING_STATE.INIT);
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

  return (
    <Row
      gutter={12}
      style={{
        display: 'flex',
        flexDirection: isMobileView ? 'column' : 'row',
      }}
    >
      <Col xl={12} lg={16} md={24} flex={1}>
        {isMobileView ? (
          <Col>
            <Record label={t(SERVICE_DESCRIPTION)} value={serviceRequestDetails?.gig_service_description!} vertical />
          </Col>
        ) : null}
        <Col>
          <Title>{t(CONTACT_DETAILS)}</Title>
          <Record
            label={t(PHONE_NUMBER)}
            value={serviceRequestDetails?.phone_number!}
            format={(value) => (
              <a target="_blank" href={`tel:${value}`} rel="noreferrer" onClick={onPhoneNav}>
                <Row justify="space-between" align="middle">
                  <div className="phone-wrapper">
                    <img src={icons.telephone} />
                    <span className="ltr-phone">{value}</span>
                  </div>
                  <Arrow />
                </Row>
              </a>
            )}
          />
          <Record
            label={t(WHATSAPP_NUMBER)}
            value={serviceRequestDetails?.whatsapp_number!}
            format={(value) => (
              <a
                target="_blank"
                href={`https://api.whatsapp.com/send?phone=${value}`}
                rel="noreferrer"
                onClick={onWhatsappNav}
              >
                <Row justify="space-between" align="middle">
                  <div className="phone-wrapper">
                    <img src={icons.whatsapp} />
                    <span className="ltr-phone">{value}</span>
                  </div>
                  <Arrow />
                </Row>
              </a>
            )}
          />
        </Col>
        <Separator vertical={10} />
        <Col>
          <Title>{t(EXTRA_INFO)}</Title>
          <Record
            label={t(ISSUE_DATE)}
            value={serviceRequestDetails?.created_at!}
            format={(value) => {
              return <DateFormat timestamp={value!} />;
            }}
          />
          <Record
            label={t(CATEGORIES)}
            value={serviceRequestDetails?.categories!.results.map((category) => category?.title!).join(', ')}
          />
          <Record label={t(BUDGET)} value={serviceRequestDetails?.budget_limits!} />
          <Record label={t(ADDITIONAL_INFO)} value={serviceRequestDetails?.description!} vertical />
        </Col>
      </Col>

      <Col className="flex-col" xl={12} lg={16} md={24}>
        <Col>
          {!isMobileView && serviceRequestDetails?.gig_service_description && (
            <Row>
              <div className="gig-desc">
                <p className="bold">{t(SERVICE_DESCRIPTION)}</p>
                <p>{serviceRequestDetails?.gig_service_description!}</p>
              </div>
            </Row>
          )}
          {serviceRequestDetails?.photos?.results?.length! > 0 && (
            <Row>
              <div className="images">
                <Title>{t(IMAGES)}</Title>
                <div className="images-wrapper">
                  {serviceRequestDetails?.photos?.results!.map((photo) => (
                    <img className="photo" key={photo?.photo!} src={photo?.photo!} />
                  ))}
                </div>
              </div>
            </Row>
          )}
        </Col>

        {isProfessional &&
        isReceivedRequest &&
        serviceRequestDetails.status === ServiceInquiryStatus.WAITING_RESPONSE ? (
          <Row gutter={10}>
            <Col span={8}>
              <Button
                size="large"
                block
                className="reject-request-btn"
                onClick={() => setShowRejectionForm(true)}
                loading={actionLoading === LOADING_STATE.PENDING_REJECT}
              >
                {t(REJECT)}
              </Button>
            </Col>
            <Col span={16}>
              <Button
                size="large"
                block
                className="accept-request-btn"
                onClick={onAcceptServiceRequest}
                loading={actionLoading === LOADING_STATE.PENDING_ACCEPT}
              >
                {t(ACCEPT_REQUEST)}
              </Button>
            </Col>
          </Row>
        ) : null}

        {/* Todo : After the BE endpoints ready */}

        {!isMobileView &&
        features[SERVICE_COMPLETED_FLOW] &&
        serviceRequestDetails.status === ServiceInquiryStatus.ACCEPTED ? (
          <Row
            gutter={10}
            style={{
              marginBottom: '10px',
            }}
          >
            <Col span={14}>
              {isProfessional && isReceivedRequest ? (
                <Button
                  size="large"
                  block
                  className="complete-request-btn"
                  onClick={onCompleteServiceRequest}
                  loading={isCompletedLoading}
                >
                  {t(REQUEST_COMPLETED)}
                </Button>
              ) : null}
            </Col>

            <Col span={serviceRequestDetails.status === ServiceInquiryStatus.ACCEPTED && !isReceivedRequest ? 24 : 10}>
              <Button
                size="large"
                block
                className="cancel-request-btn"
                onClick={HandleToggleInquiryRejectionForm}
                loading={actionLoading === LOADING_STATE.PENDING_REJECT}
              >
                {t(CANCEL_REQUEST)}
              </Button>
            </Col>
          </Row>
        ) : null}

        {(features[SERVICE_COMPLETED_FLOW] && serviceRequestDetails.status === ServiceInquiryStatus.ACCEPTED) ||
        serviceRequestDetails.status === ServiceInquiryStatus.COMPLETED ? (
          isMobileView ? (
            <div className="popover">
              {isProfessional &&
              isReceivedRequest &&
              serviceRequestDetails.status !== ServiceInquiryStatus.COMPLETED ? (
                <button className="complete" onClick={onCompleteServiceRequest}>
                  {t(COMPLETED_REQUEST)}
                </button>
              ) : null}
              {serviceRequestDetails.status !== ServiceInquiryStatus.COMPLETED ? (
                <button className="cancel" onClick={HandleToggleInquiryRejectionForm}>
                  {t(CANCEL)}
                </button>
              ) : null}

              <StartChatButton icon={<MessageIcon color="#464774" />} item={serviceRequestDetails} />
            </div>
          ) : null
        ) : null}
      </Col>

      {showRejectionForm ? (
        <ServiceRequestRejectForm
          onDismiss={onDismiss}
          onCompleteRejection={onCompleteRejection}
          id={serviceRequestDetails.id!}
        />
      ) : null}

      {showInquiryRejectionForm ? (
        <ServiceInquiryRejectForm
          onDismiss={HandleToggleInquiryRejectionForm}
          onCompleteRejection={HandleToggleInquiryRejectionForm}
          id={serviceRequestDetails.id!}
          item={serviceRequestDetails}
          modalType={modalType}
          reloadList={reloadList}
          isReceivedRequest={isReceivedRequest}
        />
      ) : null}
    </Row>
  );
};

export default ServiceRequestContent;
