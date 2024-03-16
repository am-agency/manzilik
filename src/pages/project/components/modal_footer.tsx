import { Col, Row, Form, Button, FormInstance } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../app/providers/modal';
import Separator from '../../../components/separator';
import { CANCEL, CREATE } from '../../../locales/strings';

interface Props {
  setActiveKey?: Function;
  form?: FormInstance;
}

export const ModalFooter = ({ setActiveKey, form }: Props) => {
  const { t } = useTranslation();
  const { setModalVisible } = useModal();

  const onModalCancel = () => {
    setModalVisible?.(false);
    form?.resetFields();
    setActiveKey?.('1');
  };

  return (
    <Row justify="end" className="footer-wrapper">
      <Col span={5}>
        <Form.Item>
          <Button className="modal-btn cancel-btn" onClick={onModalCancel}>
            {t(CANCEL)}
          </Button>
        </Form.Item>
      </Col>
      <Separator horizontal={10} />
      <Col span={5}>
        <Form.Item>
          <Button className="modal-btn" type="primary" htmlType="submit">
            {t(CREATE)}
          </Button>
        </Form.Item>
      </Col>
    </Row>
  );
};
