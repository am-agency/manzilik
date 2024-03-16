import { Button, Checkbox, Col, Form, Modal, Row, Skeleton, Space, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import icons from '../../../../assets/icons';
import Separator from '../../../../components/separator';
import {
  CANCEL_REQUEST,
  CONFIRM_SERVICE_REJECTION,
  HOMEOWNER,
  ISSUE_DATE,
  LETTER,
  OK,
  PLEASE_ADD_REJECTION_DETAILS,
  PROVIDER,
  REFUND_REQUEST_NOTE,
  REJECT_SERVICE_REASONS,
  REQUIRED_INFO_WILL_NOT_PREVENT_REJECTION,
  SERVICE_DESCRIPTION,
  SERVICE_PROVIDER,
  SERVICE_REQUEST_WAS_REJECTED,
  SERVICE_TYPE,
  THANKS_FOR_COMPLETE,
  UNDO,
  YOU_CAN_CONTINUE_VIEWING_SERVICE_REQUEST,
} from '../../../../locales/strings';
import {
  ServiceInquiryDetails,
  ServiceInquiryRejectionReason,
} from '../../../professionals/request_professional_service/types';
import { useServiceRequestActions } from './hooks/useServiceRequestActions';
import Success from '../../../../assets/images/Success.svg';
import CHECKED from '../../../../assets/images/checked.svg';
import { Record } from './service_request_details';
import { DateFormat } from '../../../../components/date_format';
import { FormatterProps } from '../../../contact_us/components/contact_form';
import { useClient } from '../../../../app/hooks/use_client';
import { useHistory } from 'react-router-dom';
import * as analytics from '../../../../analytics';
import { ServiceInquiry } from '../../../../API';

interface Props {
  id: string;
  onCompleteRejection: () => void;
  onDismiss: () => void;
  item: ServiceInquiry;
  modalType: string;
  reloadList: () => void;
  isReceivedRequest?: boolean;
}

export const ServiceInquiryRejectForm = ({
  id,
  onCompleteRejection,
  onDismiss,
  item,
  modalType,
  reloadList,
  isReceivedRequest,
}: Props) => {
  const { t } = useTranslation();
  const [note, setNote] = useState('');
  const { cancelledServiceRequest } = useServiceRequestActions();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCompletedConfirmation, setShowCompletedConfirmation] = useState(false);
  const listOfServices = item?.services?.results?.map((service) => service?.title).join(', ');
  const { client } = useClient();
  const history = useHistory();

  const onCancelServiceRequest = async () => {
    setLoading(true);
    try {
      await cancelledServiceRequest(id, client?.id!, note);
      const clientType = isReceivedRequest ? 'Recipient' : 'Sender';
      analytics.PublishEvent(new analytics.AnalyticsCancelService(client?.id!, clientType));

      history.push('/edit-profile/service-requests');
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    if (modalType === 'completed') {
      setShowCompletedConfirmation(true);
    }
  }, [modalType]);

  return showConfirmation ? (
    <Modal visible closable={false} footer={null} width={400}>
      <Row justify="center">
        <Col>
          <img src={Success} />
          <Separator vertical={10} />
        </Col>
        <Typography.Title level={4}>{t(SERVICE_REQUEST_WAS_REJECTED)}</Typography.Title>
        <Typography.Paragraph>{t(YOU_CAN_CONTINUE_VIEWING_SERVICE_REQUEST)}</Typography.Paragraph>
        <Separator vertical={30} />
        <Button type="primary" block onClick={onCompleteRejection}>
          {t(OK)}
        </Button>
      </Row>
    </Modal>
  ) : showCompletedConfirmation ? (
    <Modal visible closable={false} footer={null} width={400}>
      <Row justify="center" align="middle">
        <Col className="center-content-vertically">
          <Typography.Title level={4}>{t(THANKS_FOR_COMPLETE)}</Typography.Title>
          <img src={CHECKED} width={151} />
          <Separator vertical={10} />
        </Col>
        <Typography.Paragraph>{t(YOU_CAN_CONTINUE_VIEWING_SERVICE_REQUEST)}</Typography.Paragraph>
        <Separator vertical={30} />
        <Button
          type="primary"
          block
          onClick={() => {
            onCompleteRejection();
            history.push('/edit-profile/service-requests');
            reloadList();
          }}
        >
          {t(OK)}
        </Button>
      </Row>
    </Modal>
  ) : (
    <Modal visible closable={false} footer={null} className="reject-inquiry-form">
      <Row justify="end" align="middle">
        <img src={icons.close_icon} onClick={onDismiss} className="dismiss" />
      </Row>
      <Row justify="center" align="middle">
        <Typography.Title level={4}>{t(CANCEL_REQUEST)}</Typography.Title>
      </Row>

      <p className="reject-tip">
        <img src={icons.information} />
        {t(REQUIRED_INFO_WILL_NOT_PREVENT_REJECTION)}
      </p>
      <Record label={t(SERVICE_TYPE)} value={listOfServices} />
      <Record label={t(SERVICE_PROVIDER)} value={item?.professional?.company_name!} />

      <Record
        label={t(ISSUE_DATE)}
        value={item?.created_at!}
        format={(value) => {
          return <DateFormat timestamp={value!} />;
        }}
      />

      <Form.Item label={t(REFUND_REQUEST_NOTE)} name="description">
        <TextArea
          placeholder={t(PLEASE_ADD_REJECTION_DETAILS)}
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          minLength={50}
          maxLength={200}
          showCount
        />
      </Form.Item>
      <Separator vertical={20} />
      <Row gutter={10}>
        <Col span={24}>
          <Button
            className="reject-btn"
            block
            loading={loading}
            onClick={onCancelServiceRequest}
            disabled={note.length < 1}
          >
            {t(CONFIRM_SERVICE_REJECTION)}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
