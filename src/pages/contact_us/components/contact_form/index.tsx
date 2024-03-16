import React, { FunctionComponent, useState } from 'react';
import { Button, Col, Form, Input, Row, Typography, Modal, FormInstance } from 'antd';
import {
  HOW_CAN_WE_HELP,
  WRITE_FULL_NAME,
  EMAIL_HERE,
  FULL_NAME,
  EMAIL,
  MESSAGE_CONTENT,
  MESSAGE_CONTENT_HERE,
  LETTER,
  SEND_NOW,
  REQUIRED,
  PLEASE_WRITE_VALID_EMAILS,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../components/separator';
import { required } from '../../../projects/add_new_project';
import { AR } from '../../../../locales/constants';
import { checkEmptyString } from '../../../../utils';
import { EMAIL_REGEX } from '../../../auth/signup/constants';
import { SuccessfulSubmissionModal } from '../../submit_modal';
import { useHistory } from 'react-router';
import { ContactUsInput } from '../../../../API';
import { useForm } from 'antd/lib/form/Form';

export interface FormatterProps {
  count: number;
  maxLength?: number;
}

interface Props {
  onFinish: (form: FormInstance) => void;
  isModalVisible: boolean;
  setIsModalVisible: Function;
}

export const ContactForm: FunctionComponent<Props> = ({ onFinish, isModalVisible, setIsModalVisible }: Props) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const [form] = useForm();
  const counterClassName = i18n.language === AR ? 'msg-textarea-ar' : 'msg-textarea-en';

  const onOk = () => {
    setIsModalVisible(false);
    history.push('/');
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishForm = () => {
    onFinish(form);
  };

  return (
    <Row className="contact_form">
      <Col span={24}>
        <h3 className="sub-heading-text">{t(HOW_CAN_WE_HELP)}</h3>
        <Separator vertical={8} />
      </Col>
      <Col span={24}>
        <Form className="form" layout="vertical" form={form} onFinish={onFinishForm}>
          <Typography.Text>{t(FULL_NAME)}</Typography.Text>
          <Form.Item
            rules={[
              required,
              ({ setFieldsValue }) => ({
                validator(_, value) {
                  return checkEmptyString(
                    value,
                    (val: string) => {
                      setFieldsValue({
                        title: val,
                      });
                    },
                    t(REQUIRED)
                  );
                },
              }),
            ]}
            name="name"
          >
            <Input
              placeholder={t(WRITE_FULL_NAME)}
              onPressEnter={(e) => {
                e.preventDefault();
              }}
            />
          </Form.Item>
          <Typography.Text>{t(EMAIL)}</Typography.Text>
          <Form.Item
            rules={[
              required,
              {
                pattern: EMAIL_REGEX,
                message: t(PLEASE_WRITE_VALID_EMAILS),
              },
              ({ setFieldsValue }) => ({
                validator(_, value) {
                  return checkEmptyString(
                    value,
                    (val: string) => {
                      setFieldsValue({
                        email: val,
                      });
                    },
                    t(REQUIRED)
                  );
                },
              }),
            ]}
            name="email"
          >
            <Input placeholder={t(EMAIL_HERE)} />
          </Form.Item>
          <Typography.Text>{t(MESSAGE_CONTENT)}</Typography.Text>
          <Form.Item
            rules={[
              required,
              ({ setFieldsValue }) => ({
                validator(_, value) {
                  return checkEmptyString(
                    value,
                    (val: string) => {
                      setFieldsValue({
                        message: val,
                      });
                    },
                    t(REQUIRED)
                  );
                },
              }),
            ]}
            name="message"
          >
            <Input.TextArea
              className={counterClassName}
              placeholder={t(MESSAGE_CONTENT_HERE)}
              maxLength={270}
              showCount={{
                formatter: ({ count, maxLength }: FormatterProps) => `${count}/${maxLength} ${t(LETTER)}`,
              }}
            />
          </Form.Item>
          <Form.Item className="submit-button-item">
            <Button type="primary" htmlType="submit">
              {t(SEND_NOW)}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <SuccessfulSubmissionModal onOk={onOk} onCancel={onCancel} isModalVisible={isModalVisible} />
    </Row>
  );
};
