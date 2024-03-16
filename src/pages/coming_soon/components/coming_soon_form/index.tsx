import React from 'react';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  EMAIL,
  ENTER,
  FIELD_SHOULD_BE_URL,
  FULL_NAME,
  INESTEGRAM_ACCOUNT,
  JOIN_OUR_VENDORS,
  PHONE_NUMBER,
  PLEASE_ENTER_VALID_PHONE_NUMBER,
  PLEASE_WRITE_VALID_EMAILS,
  REQUIRED,
  STORE_NAME,
  WEBSITE,
} from '../../../../locales/strings';
import { addPartner } from '../../api';
import { useMainContext } from '../../../../app/providers/main';
import { PartnerInput } from '../../../../API';
import { required } from '../../../projects/add_new_project';
import { EMAIL_REGEX, PHONE_REGEX_WITH_PLUS } from '../../../auth/signup/constants';
import { isValidURL } from '../../../project/utils';
import { DONE } from '../../../projects/constants';
import { ModalTitle } from '../../../../components/modal_title';
import { useModal } from '../../../../app/providers/modal';
import Separator from '../../../../components/separator';
import { Link } from 'react-router-dom';
import { ComingSoonSuccessModal } from '../coming_soon_success_modal';
import { checkEmptyString } from '../../../../utils';

export const ComingSoonForm = () => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { showModal, form } = useModal();

  const onFinish = (formValues: PartnerInput) => {
    requestApi(addPartner, { ...formValues }, (response: { message: string; status: string }, error: string) => {
      if (error) {
        return;
      }
      form?.resetFields();
      if (response.message == DONE) {
        showModal(
          <ModalTitle />,
          <ComingSoonSuccessModal />,
          'coming-soon-modal modal-wrapper modal-with-custom-footer',
          '',
          <div />
        );
      }
    });
  };

  return (
    <Form form={form} className="coming-soon-form" validateTrigger="onSubmit" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Typography.Text>
            {t(FULL_NAME)}
            <span className="required-sign"> * </span>
          </Typography.Text>
          <Form.Item name="name" rules={[required]}>
            <Input placeholder={`${t(ENTER)} ${t(FULL_NAME)}`} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Typography.Text>
            {t(PHONE_NUMBER)}
            <span className="required-sign"> * </span>
          </Typography.Text>
          <Form.Item
            name="mobile"
            rules={[
              required,
              () => ({
                ...required,
                validator(_, value) {
                  if (!PHONE_REGEX_WITH_PLUS.test(value)) {
                    return Promise.reject(t(PLEASE_ENTER_VALID_PHONE_NUMBER));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder={`${t(ENTER)} ${t(PHONE_NUMBER)}`} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Typography.Text>
            {t(STORE_NAME)}
            <span className="required-sign"> * </span>
          </Typography.Text>
          <Form.Item name="store_name" rules={[required]}>
            <Input placeholder={`${t(ENTER)} ${t(STORE_NAME)}`} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Typography.Text>
            {t(EMAIL)}
            <span className="required-sign"> * </span>
          </Typography.Text>
          <Form.Item
            name="email"
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
          >
            <Input placeholder={`${t(ENTER)} ${t(EMAIL)}`} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Typography.Text>{t(WEBSITE)}</Typography.Text>
          <Form.Item
            name="website"
            rules={[
              () => ({
                validator(_, inputValue) {
                  if (isValidURL(inputValue)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t(FIELD_SHOULD_BE_URL)));
                },
              }),
            ]}
          >
            <Input placeholder={`${t(ENTER)} ${t(WEBSITE)}`} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Typography.Text>{t(INESTEGRAM_ACCOUNT)}</Typography.Text>
          <Form.Item name="instagram_account">
            <Input placeholder={`${t(ENTER)} ${t(INESTEGRAM_ACCOUNT)}`} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="send-data">
          {t(JOIN_OUR_VENDORS)}
        </Button>
      </Form.Item>
    </Form>
  );
};
