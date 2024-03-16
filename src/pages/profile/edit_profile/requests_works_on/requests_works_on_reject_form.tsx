import { Button, Checkbox, Col, Form, Modal, Row, Skeleton, Space, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import icons from '../../../../assets/icons';
import Separator from '../../../../components/separator';
import {
  CONFIRM_SERVICE_REJECTION,
  OK,
  PLEASE_ADD_REJECTION_DETAILS,
  REJECT_SERVICE_REASONS,
  REQUIRED_INFO_WILL_NOT_PREVENT_REJECTION,
  SERVICE_REQUEST_WAS_REJECTED,
  UNDO,
  YOU_CAN_CONTINUE_VIEWING_SERVICE_REQUEST,
} from '../../../../locales/strings';
import { ServiceInquiryRejectionReason } from '../../../professionals/request_professional_service/types';
import { useServiceRequestActions } from './hooks/useServiceRequestActions';
import Success from '../../../../assets/images/Success.svg';

interface Props {
  id: string;
  onCompleteRejection: () => void;
  onDismiss: () => void;
}

export const RequestsWorksOnRejectForm = ({ id, onCompleteRejection, onDismiss }: Props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ServiceInquiryRejectionReason[]>([]);
  const [note, setNote] = useState('');
  const { rejectServiceRequest, rejectionReasons, loadRejectionReasons } = useServiceRequestActions();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadRejectionReasons();
  }, []);

  const onSelect = (reason: ServiceInquiryRejectionReason) => {
    setSelected((pre) => [...pre, reason]);
  };

  const onDeselect = (reason: ServiceInquiryRejectionReason) => {
    setSelected((pre) => pre.filter((item) => item.id !== reason.id));
  };

  const showNote = useMemo(() => {
    return selected.some((reason) => reason.is_note_required);
  }, [selected]);

  const onRejectServiceRequest = async () => {
    setLoading(true);
    try {
      await rejectServiceRequest(
        id,
        selected.map((reason) => reason.id),
        showNote ? note : undefined
      );
      setShowConfirmation(true);
    } catch (error) {}
    setLoading(false);
  };

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
  ) : (
    <Modal visible closable={false} footer={null} className="reject-form">
      <Row justify="space-between" align="middle">
        <Typography.Title level={4}>{t(REJECT_SERVICE_REASONS)}</Typography.Title>
        <Typography.Text className="request-id">
          <span className="hash">#</span>
          {id}
        </Typography.Text>
      </Row>
      <hr />
      <p className="reject-tip">
        <img src={icons.information} />
        {t(REQUIRED_INFO_WILL_NOT_PREVENT_REJECTION)}
      </p>

      {rejectionReasons.length === 0 ? (
        <Skeleton paragraph={false} title={{ width: '50px' }} />
      ) : (
        rejectionReasons.map((reason) => (
          <Form.Item name="rejection_reasons" key={reason.id} className="rejection-reason">
            <Checkbox value={reason.id} onChange={(e) => (e.target.checked ? onSelect(reason) : onDeselect(reason))} />
            <Separator horizontal={5} />
            <Typography.Paragraph strong>{reason.title}</Typography.Paragraph>
          </Form.Item>
        ))
      )}

      <Separator vertical={10} />

      {showNote ? (
        <>
          <TextArea
            placeholder={t(PLEASE_ADD_REJECTION_DETAILS)}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></TextArea>
          <Separator vertical={20} />
        </>
      ) : null}

      <Row gutter={10}>
        <Col span={6}>
          <Button className="undo-btn" block loading={loading} onClick={onDismiss}>
            {t(UNDO)}
          </Button>
        </Col>
        <Col span={18}>
          <Button
            className={`reject-btn ${selected.length === 0 ? 'disabled' : ''}`}
            block
            loading={loading}
            onClick={onRejectServiceRequest}
            disabled={selected.length === 0}
          >
            {t(CONFIRM_SERVICE_REJECTION)}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
