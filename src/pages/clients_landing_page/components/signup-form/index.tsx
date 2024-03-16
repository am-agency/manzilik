import React, { FunctionComponent } from 'react';
import { Button, Col, Form, FormInstance, Input, Row } from 'antd';
import {
  EMAIL,
  JOINT_US_NOW,
  LOGIN_WITH_GOOGLE,
  OR_SIGH_UP_WITH,
  PASSWORD,
  PASSWORD_REQUIRED_MESSAGE,
  PLEASE_WRITE_VALID_EMAILS,
  REGEX_DOESNT_MATCH_MSG,
  REQUIRED,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { landingPagesIcons } from '../../../../assets/icons/landing-pages';
import Separator from '../../../../components/separator';
import { required } from '../../../projects/add_new_project';
import { checkEmptyString } from '../../../../utils';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../../auth/signup/constants';
import { SignupParams } from '../../../auth/signup/types';

interface Props {
  onFinish: (values: SignupParams) => void;
  onGoogleClick: () => void;
  form?: FormInstance;
}

export const ClientsLandingPageSignUpForm: FunctionComponent<Props> = (props: Props) => {
  const { onFinish, onGoogleClick, form } = props;

  const { t } = useTranslation();
  return (
    <Row justify="end" className="signup-form">
      <Col xl={20} lg={23} md={24} sm={24} xs={24}>
        <Separator vertical={10} />
        <Button onClick={onGoogleClick} block className="social-btn" icon={<img src={landingPagesIcons.google.icon} />}>
          {t(LOGIN_WITH_GOOGLE)}
        </Button>
      </Col>
      <Col xl={20} lg={23} md={24} sm={24} xs={24} className="register-label">
        <p>{t(OR_SIGH_UP_WITH)}</p>
      </Col>
      <Col xl={20} lg={23} md={24} sm={24} xs={24}>
        <Form className="form" layout="vertical" onFinish={onFinish} form={form}>
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
            className="custom-ant-input"
            name="username"
          >
            <Input autoComplete={'false'} placeholder={t(EMAIL)} />
          </Form.Item>
          <Form.Item
            name="password"
            className="custom-ant-input"
            rules={[
              { required: true, message: t(PASSWORD_REQUIRED_MESSAGE) },
              {
                pattern: PASSWORD_REGEX,
                message: t(REGEX_DOESNT_MATCH_MSG),
              },
            ]}
          >
            <Input type="password" placeholder={t(PASSWORD)} />
          </Form.Item>
          <Form.Item className="submit-button-item">
            <Button type="primary" htmlType="submit">
              {t(JOINT_US_NOW)}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
