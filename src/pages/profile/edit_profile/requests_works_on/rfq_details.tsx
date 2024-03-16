import { Col, Row, Typography } from 'antd';
import React, { PropsWithChildren, ReactElement, useEffect, useMemo, useState } from 'react';

import { REQUEST_DETAILS } from '../../../../locales/strings';
import { useServiceRequestTable } from './hooks/useServiceRequestTable';
import { useServiceRequestDetails } from './hooks/useServiceRequestDetails';
import { useTranslation } from 'react-i18next';
import { useServiceRequestActions } from './hooks/useServiceRequestActions';
import { useMediaQuery } from 'react-responsive';
import Separator from '../../../../components/separator';
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
    </section>
  );
};

export default QuotationsDetails;
