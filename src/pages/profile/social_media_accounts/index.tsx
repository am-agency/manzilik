import React, { useState } from 'react';
import { Input, Row, Form, Col, Button } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { useTranslation } from 'react-i18next';
import { Client, EditClientProfileInput } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { FACEBOOK, TWITTER, LINKEDIN, WEBSITE_OR_BLOG, UPDATE, SOCIAL_MEDIA_SETTINGS } from '../../../locales/strings';
import { updateAccountInformation } from '../api';
import { PrivateProfileHeader } from '../edit_profile/components/profile_header';
import Separator from '../../../components/separator';

interface Props {
  client?: Client;
}

export const SocialMediaAccount = (props: Props) => {
  const { client } = props;
  const { requestApi } = useMainContext();

  const onFinish = (values: EditClientProfileInput) => {
    requestApi(updateAccountInformation, values);
  };

  const { t } = useTranslation();
  return (
    <Row className="form social-media-settings">
      <Form onFinish={onFinish} initialValues={client}>
        <PrivateProfileHeader title={t(SOCIAL_MEDIA_SETTINGS)} />
        <Separator vertical={15} />
        <Row gutter={20}>
          <Col span={12}>
            <span>{t(TWITTER)}</span>
            <Form.Item name="twitter">
              <Input className="social-md-input"></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <span>{t(FACEBOOK)}</span>
            <Form.Item name="facebook">
              <Input className="social-md-input"></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <span>{t(LINKEDIN)}</span>
            <Form.Item name="linkedin">
              <Input className="social-md-input"></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <span>{t(WEBSITE_OR_BLOG)}</span>
            <Form.Item name="blog">
              <Input className="social-md-input"></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row align="middle" justify="end">
          <Button type="primary" htmlType="submit" className="submit-button">
            {t(UPDATE)}
          </Button>
        </Row>
      </Form>
    </Row>
  );
};

export default SocialMediaAccount;
