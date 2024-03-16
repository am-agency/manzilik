import React from 'react';
import { Button, Col, Form, Input, message, Row, Switch, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { ContactMeInput, Professional, ResultOutput } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { useModal } from '../../../../app/providers/modal';
import Separator from '../../../../components/separator';
import {
  EMAIL,
  MESSAGE,
  TO,
  NAME,
  MOBILE_NUMBER,
  PROJECT_ZIP_CODE,
  SAVE_YOUR_MESSAGE,
  TELL_YOUR_PROFESSIONAL,
  DONE,
} from '../../../../locales/strings';
import { getUserName } from '../../../../utils';
import { required } from '../../../projects/add_new_project';
import { contactMe } from '../../api';
import { Review } from '../review';

interface Props {
  professional: Professional;
}

export const SendMessageProfessional = ({ professional }: Props) => {
  const { client } = professional;
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { form } = useModal();

  const onFinish = (values: ContactMeInput) => {
    requestApi(contactMe, { ...values, professional_id: professional.id }, (response: ResultOutput, error: string) => {
      if (error) {
        return;
      }
      message.success(t(DONE));
    });
  };

  return (
    <Form className="form send-professional-form" onFinish={onFinish} form={form}>
      <Typography.Text>{t(TO)}</Typography.Text>
      <Row>
        <div className="img-wrapper">
          <img src={client?.profile_image!} className="img-fit-content" />
        </div>
        <Separator horizontal={15} />
        <div>
          <Typography.Text>{getUserName(client)}</Typography.Text>
          <Review reviews_total={professional.reviews_total!} reviews_count={professional.reviews_count!} />
        </div>
      </Row>
      <Separator vertical={24} />
      <Row gutter={25}>
        <Col span={12}>
          <Typography.Text className="form-label"> {t(NAME)}</Typography.Text>
          <Form.Item name="name" rules={[required]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Typography.Text className="form-label">{t(EMAIL)}</Typography.Text>
          <Form.Item name="email" rules={[required]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={25}>
        <Col span={12}>
          <Typography.Text className="form-label">{t(MOBILE_NUMBER)}</Typography.Text>
          <Form.Item name="mobile">
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Typography.Text className="form-label">{t(PROJECT_ZIP_CODE)}</Typography.Text>
          <Form.Item name="project_zip_code">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Typography.Text className="form-label">{t(MESSAGE)}</Typography.Text>
      <Form.Item name="message" rules={[required]}>
        <Input.TextArea placeholder={t(TELL_YOUR_PROFESSIONAL)} />
      </Form.Item>
      {/* @TODO: comming soon <Form.Item>
        <Switch /> <Typography.Text>{t(SAVE_YOUR_MESSAGE)}</Typography.Text>
      </Form.Item> */}
    </Form>
  );
};
