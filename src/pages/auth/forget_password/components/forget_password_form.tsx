import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../app/i18n';
import { getLayoutDirection } from '../../../../app/layouts';
import { EMAIL, MOBILE } from '../../../../app/settings';
import { CustomSwitch } from '../../../../components/custom_switch';
import {
  EMAIL as EMAIL_TEXT,
  EMAIL_REQUIRED_MESSAGE,
  MAIL,
  MOBILE as MOBILE_TEXT,
  SEND_CONFIRMATION_CODE,
  RESET_YOUR_PASSWORD,
  REQUIRED,
  PLEASE_WRITE_VALID_EMAILS,
  PLEASE_ENTER_VALID_PHONE_NUMBER_EX,
} from '../../../../locales/strings';
import Logo from '../../../../components/logo';
import { useForm } from 'antd/es/form/Form';
import { EMAIL_REGEX, PHONE_REGEX_WITH_PLUS } from '../../signup/constants';

interface Props {
  onFinish: Function;
}

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ForgetPasswordForm: React.FunctionComponent<Props> = ({ onFinish }: Props) => {
  const { t } = useTranslation();
  const query = useQuery();
  const email = query.get('email');
  const mobile = query.get('mobile');
  const [type, setType] = useState<string>(email ? EMAIL : mobile ? MOBILE : EMAIL);
  const [form] = useForm();

  useEffect(() => {
    if (!!email || !!mobile) {
      form.setFieldsValue({
        username: email || mobile,
      });
    }
  }, []);

  const onChange = (checked: boolean) => {
    const status = checked ? EMAIL : MOBILE;
    setType(status);
    form?.setFieldsValue({
      username: null,
      password: null,
    });
  };

  return (
    <div className="form normal-switch forget-password-wrapper">
      <div className="logo-wrapper">
        <Logo />
      </div>
      <Row justify="center" className="forget-password-form">
        <Col xl={7} lg={7} md={14} xs={22} sm={22} className="forget-password">
          <h4 className="title">{t(RESET_YOUR_PASSWORD)}</h4>
          <Form name="basic" onFinish={(values) => onFinish(values)} form={form}>
            <Form.Item
              name="username"
              className="group-floating-label"
              rules={[
                { required: true, message: t(REQUIRED) },
                {
                  pattern: type === EMAIL ? EMAIL_REGEX : PHONE_REGEX_WITH_PLUS,
                  message: type === EMAIL ? t(PLEASE_WRITE_VALID_EMAILS) : t(PLEASE_ENTER_VALID_PHONE_NUMBER_EX),
                },
              ]}
            >
              <Input
                className="signup-input form-input switch-input-wrapper"
                type={type == EMAIL ? 'email' : 'text'}
                autoComplete="username"
                inputMode="email"
                placeholder="."
                defaultValue={email || mobile || ''}
                disabled={!!email || !!mobile}
                suffix={
                  <>
                    <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="email">
                      {type == EMAIL ? t(EMAIL_TEXT) : t(MOBILE_TEXT)}
                    </label>
                    <CustomSwitch
                      type={type}
                      onChange={onChange}
                      defaultValue={EMAIL}
                      firstLabel={t(MOBILE_TEXT)}
                      secondLabel={t(MAIL)}
                      disabled={!!email || !!mobile}
                    />
                  </>
                }
              />
            </Form.Item>
            <Form.Item className="forget-pass-item">
              <Button type="primary" htmlType="submit" className="submit-button">
                {t(SEND_CONFIRMATION_CODE)}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
