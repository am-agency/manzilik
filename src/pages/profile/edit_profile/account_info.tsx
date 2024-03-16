import React, { useEffect } from 'react';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import icons from '../../../assets/icons';
import {
  ACCOUNT_INFORMATION,
  PROFILE_INFORMATION,
  FIRST_NAME,
  LAST_NAME,
  PUBLICLY_DISPLAYED,
  ABOUT_ME,
  MY_FAVORITE_STYLE,
  MY_NEXT_MANZILIK_PROJECT,
  EMAIL,
  USER_NAME,
  UPDATE,
} from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { Client } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { useForm } from 'antd/lib/form/Form';

interface Props {
  onUpdateClientInformation: Function;
  client: Client;
}

export const AccountInfo: React.FunctionComponent<Props> = ({ onUpdateClientInformation, client }: Props) => {
  const { t } = useTranslation();
  const { userState } = useMainContext();
  const [form] = useForm();
  const onFinish = (values: Client) => {
    const newValues = { ...values };
    delete newValues.email;
    onUpdateClientInformation(newValues);
  };

  useEffect(() => {
    form.setFieldsValue(client);
  }, [client]);

  return (
    <Form form={form} name="basic" onFinish={onFinish} className="form account-info" initialValues={userState.client}>
      <Typography.Text> {t(EMAIL)}</Typography.Text>
      <Row gutter={16} align="middle">
        <Col xl={22} lg={22} md={22} sm={18} xs={18}>
          <Form.Item name="email" initialValue={userState?.client?.email || userState.user?.email}>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col xl={2} lg={2} md={2} sm={6} xs={6}>
          <div className="icon-container">
            <img src={icons.edit.icon} />
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={22}>
          <Typography.Text className="sub-title">{t(PROFILE_INFORMATION)}</Typography.Text>
          <Row gutter={20}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <p className="public-text">
                <Typography.Text> {`${t(FIRST_NAME)} (${t(PUBLICLY_DISPLAYED)})`}</Typography.Text>
              </p>
              <Form.Item name="first_name" initialValue={userState?.client?.first_name || userState.user?.first_name}>
                <Input />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <p className="public-text">
                <Typography.Text> {`${t(LAST_NAME)} (${t(PUBLICLY_DISPLAYED)})`}</Typography.Text>
              </p>

              <Form.Item name="last_name" initialValue={client?.last_name || userState.user?.family_name}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Typography.Text>{t(ABOUT_ME)}</Typography.Text>
          <Form.Item name="about_me" initialValue={client?.about_me}>
            <Input.TextArea />
          </Form.Item>
          <Typography.Text>{t(MY_FAVORITE_STYLE)}</Typography.Text>
          <Form.Item name="my_fav_style" initialValue={client?.my_fav_style}>
            <Input.TextArea />
          </Form.Item>
          <Typography.Text>{t(MY_NEXT_MANZILIK_PROJECT)}</Typography.Text>
          <Form.Item name="my_next_style" initialValue={client?.my_next_style}>
            <Input.TextArea />
          </Form.Item>
          <Row gutter={20}>
            <Col xl={20} lg={20} md={0} sm={0} xs={0} />
            <Col lg={4} xl={4} md={6} xs={12} sm={12}>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="submit-button">
                  {t(UPDATE)}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
