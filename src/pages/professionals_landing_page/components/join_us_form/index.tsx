import React, { FunctionComponent } from 'react';
import { Button, Col, Form, FormInstance, Input, Row } from 'antd';
import { required } from '../../../projects/add_new_project';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../../auth/signup/constants';
import ReCAPTCHA from 'react-google-recaptcha';

import {
  EMAIL,
  JOINT_US_NOW,
  LOGIN_WITH_GOOGLE,
  PASSWORD,
  PASSWORD_REQUIRED_MESSAGE,
  PLEASE_WRITE_VALID_EMAILS,
  REGEX_DOESNT_MATCH_MSG,
  REQUIRED,
} from '../../../../locales/strings';
import { checkEmptyString } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { landingPagesIcons } from '../../../../assets/icons/landing-pages';
import { SignupParams } from '../../../auth/signup/types';

interface Props {
  onFinish: (values: SignupParams) => void;
  form?: FormInstance;
  onGoogleClick: () => void;
}

const { REACT_APP_RECAPTCHA_SITE_KEY } = process.env;
export const ProfessionalsLandingPageJoinUsForm: FunctionComponent<Props> = (props: Props) => {
  const { onFinish, form, onGoogleClick } = props;
  const { t, i18n } = useTranslation();

  return (
    <Row justify="space-between" wrap={true} gutter={[24, 16]}>
      <Form className="form" layout="horizontal" onFinish={onFinish} form={form}>
        <Col xl={8} lg={8} md={8} sm={12} xs={24}>
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
            name="username"
          >
            <Input autoComplete="false" placeholder={t(EMAIL)} />
          </Form.Item>
        </Col>
        <Col xl={8} lg={8} md={8} sm={12} xs={24}>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t(PASSWORD_REQUIRED_MESSAGE) },
              {
                pattern: PASSWORD_REGEX,
                message: t(REGEX_DOESNT_MATCH_MSG),
              },
            ]}
          >
            <Input type="password" autoComplete="false" placeholder={t(PASSWORD)} />
          </Form.Item>
        </Col>
        <Col xl={8} lg={8} md={8} sm={12} xs={24}>
          <Form.Item className="submit-button-item">
            <Button type="primary" htmlType="submit">
              {t(JOINT_US_NOW)}
            </Button>
          </Form.Item>
        </Col>
        <Col xl={8} lg={8} md={8} sm={12} xs={24}>
          <Form.Item name="recaptcha" className="recaptcha">
            <ReCAPTCHA sitekey={REACT_APP_RECAPTCHA_SITE_KEY!} />
          </Form.Item>
        </Col>
      </Form>
      <Col span={24} className="social-btn">
        {/* will hide it for now because of a bug related to the user role
         <Button onClick={onGoogleClick} icon={<img src={landingPagesIcons.google.icon} />}>
          {t(LOGIN_WITH_GOOGLE)}
        </Button> */}
      </Col>
    </Row>
  );
};
