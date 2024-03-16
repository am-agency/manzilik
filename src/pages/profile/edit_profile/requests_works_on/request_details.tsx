import { Col, Row, Space, Table, Typography } from 'antd';
import React, { PropsWithChildren, ReactElement, useEffect, useMemo, useState } from 'react';

import {
  HOMEOWNER,
  ISSUE_DATE,
  LOADING,
  PHONE_NUMBER,
  REQUEST_ACCEPTED_CONTACT_OWNER,
  REQUEST_DETAILS,
  REQUEST_NUMBER,
  REQUEST_STATUS,
  SAR,
  SERVICE_PRICE,
  SERVICE_TYPE,
} from '../../../../locales/strings';
import { useServiceRequestDetails } from './hooks/useServiceRequestDetails';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../components/loading';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AR } from '../../../../locales/constants';
import { useServiceRequestActions } from './hooks/useServiceRequestActions';
import { ServiceInquiryStatus } from '../../../professionals/request_professional_service/types';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import { useFeatures } from 'flagged';
import { useClient } from '../../../../app/hooks/use_client';

import i18n from '../../../../app/i18n';
import icons from '../../../../assets/icons';
import Separator from '../../../../components/separator';
import Loader from 'react-spinners/ClipLoader';
import * as analytics from '../../../../analytics';
import { DateFormat } from '../../../../components/date_format';
import QuotationsRequestContent from '../service_requests/components/quotations_request_content';
import ServiceRequestContent from '../requests_works_on/components/service_request_content';
import { useServiceRequestTable } from './hooks/useServiceRequestTable';

interface Props {
  serviceRequestId: string;
  isProfessional: boolean;
  reloadList: () => void;
  activeTab: number;
  isQuotationRequest?: boolean;
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

export enum LOADING_STATE {
  INIT,
  PENDING_ACCEPT,
  PENDING_REJECT,
}

export const RequestDetails = ({
  serviceRequestId,
  isProfessional,
  reloadList,
  activeTab,
  isQuotationRequest,
}: Props) => {
  const { t } = useTranslation();
  const { loadServiceRequestDetails, serviceRequestDetails, setRequestStatus, isServiceRequestDetailsLoading } =
    useServiceRequestDetails();
  const table = useServiceRequestTable();
  const { acceptServiceRequest, completedServiceRequest } = useServiceRequestActions();
  const [actionLoading, setActionLoading] = useState<LOADING_STATE>(LOADING_STATE.INIT);
  const [isCompletedLoading, setIsCompletedLoading] = useState(false);
  const [showConfirmAcceptToast, setShowConfirmAcceptToast] = useState(false);
  const listOfServices = serviceRequestDetails?.services?.results?.map((service) => service?.title).join(', ');
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });

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

  return (
    <section className="service-request-details">
      <Separator vertical={20} />
      <Title>{t(REQUEST_DETAILS)}</Title>
      {serviceRequestDetails ? (
        <>
          <Row gutter={12}>
            <Col xl={24} lg={24} md={24} flex={1}>
              {isMobileView ? (
                <div className="order-details-table">
                  <div className="order-num-and-status">
                    <div className="order-num">
                      <p className="order-num-title">{t(REQUEST_NUMBER)} </p>
                      <p className="number"> {serviceRequestDetails?.number} </p>
                    </div>
                    <div className="middle-line"></div>
                    <div className="order-status">
                      <p className="order-status-title">{t(REQUEST_STATUS)}</p>
                      <p>
                        <span className={serviceRequestDetails?.status!.toLocaleLowerCase()}>
                          {t((serviceRequestDetails?.status as unknown as string) + '_REQUEST')}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="other-details">
                    <Record label={t(SERVICE_TYPE)} value={listOfServices} />
                    <Record label={t(HOMEOWNER)} value={serviceRequestDetails?.sender?.first_name!} />
                    {serviceRequestDetails?.phone_number && (
                      <Record
                        label={t(PHONE_NUMBER)}
                        value={` ${i18n.language !== AR ? '+' : ''} ${serviceRequestDetails?.phone_number} ${
                          i18n.language === AR ? '+' : ''
                        }`}
                      />
                    )}

                    {serviceRequestDetails?.gig_service_price ? (
                      <Record
                        label={t(SERVICE_PRICE)}
                        value={`${JSON.stringify(serviceRequestDetails?.gig_service_price)} ${t(SAR)}`}
                      />
                    ) : null}

                    <Record
                      label={t(ISSUE_DATE)}
                      value={serviceRequestDetails?.created_at!}
                      format={(value) => {
                        return <DateFormat timestamp={value!} />;
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Table
                  className="data-table"
                  columns={table.detailsColumns}
                  dataSource={table.data}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <Space direction="vertical">
                        <Loading label={t(LOADING)} />
                      </Space>
                    ),
                  }}
                />
              )}
            </Col>
          </Row>
          <Separator vertical={10} />
          {isQuotationRequest ? (
            <QuotationsRequestContent
              serviceRequestDetails={serviceRequestDetails}
              isProfessional={isProfessional}
              reloadList={reloadList}
              showConfirmAcceptToast={showConfirmAcceptToast}
              setShowConfirmAcceptToast={setShowConfirmAcceptToast}
              activeTab={activeTab}
            />
          ) : (
            <ServiceRequestContent
              serviceRequestDetails={serviceRequestDetails}
              isProfessional={isProfessional}
              reloadList={reloadList}
              showConfirmAcceptToast={showConfirmAcceptToast}
              setShowConfirmAcceptToast={setShowConfirmAcceptToast}
            />
          )}
        </>
      ) : (
        <div className="loader-wrapper">
          <Loader />
        </div>
      )}
      <p className={`accept-toast ${showConfirmAcceptToast ? 'show' : ''}`}>
        <img src={icons.tick} />
        {t(REQUEST_ACCEPTED_CONTACT_OWNER)}
      </p>
    </section>
  );
};
