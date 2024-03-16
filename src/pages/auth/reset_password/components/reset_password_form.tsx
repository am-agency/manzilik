import { EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../app/i18n';
import { getLayoutDirection } from '../../../../app/layouts';
import { useMainContext } from '../../../../app/providers/main';
import Logo from '../../../../components/logo';

import {
  PASSWORD_DONT_MATCH,
  SAVE_PASSWORD,
  PASSWORD_REQUIRED_MESSAGE,
  REGEX_DOESNT_MATCH_MSG,
  NEW_PASSWORD,
  CONFIRM_NEW_PASSWORD,
  CODE_TEXT,
} from '../../../../locales/strings';
import { required } from '../../../projects/add_new_project';
import { PASSWORD_REGEX } from '../../signup/constants';

interface Props {
  onFinish: Function;
}
export const ResetPasswordForm: React.FunctionComponent<Props> = ({ onFinish }: Props) => {
  const { t } = useTranslation();
  const [isPassword, showPassword] = useState<boolean>(false);
  const [isNewPassword, showNewPassword] = useState<boolean>(false);

  const onPasswordIconClick = () => {
    showPassword(!isPassword);
  };

  const onNewPasswordIconClick = () => {
    showNewPassword(!isNewPassword);
  };

  return (
    <div className="form normal-switch forget-password-wrapper">
      <div className="logo-wrapper">
        <Logo />
      </div>
      <Row justify="center" className="form reset-password forget-password-form">
        <Col xl={7} lg={7} md={14} sm={22} xs={22} className="forget-password">
          <h4 className="title">{t(NEW_PASSWORD)}</h4>
          <Form name="basic" onFinish={(values) => onFinish(values)}>
            <Form.Item className="group-floating-label" name="code" rules={[required]}>
              <Input
                className="signup-input form-input"
                type={'number'}
                placeholder="."
                autoComplete="off"
                suffix={
                  <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="password">
                    {t(CODE_TEXT)}
                  </label>
                }
              />
            </Form.Item>
            <Form.Item
              className="group-floating-label"
              name="password"
              rules={[
                {
                  required: true,
                  message: t(PASSWORD_REQUIRED_MESSAGE),
                },
                {
                  pattern: PASSWORD_REGEX,
                  message: t(REGEX_DOESNT_MATCH_MSG),
                },
              ]}
            >
              <Input
                className="signup-input form-input"
                type={isPassword ? 'text' : 'password'}
                placeholder="."
                suffix={
                  <>
                    <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="password">
                      {t(NEW_PASSWORD)}
                    </label>
                    <EyeInvisibleOutlined onClick={onPasswordIconClick} />
                  </>
                }
              />
            </Form.Item>
            <Form.Item
              className="group-floating-label"
              name="confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: t(PASSWORD_REQUIRED_MESSAGE) },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t(PASSWORD_DONT_MATCH)));
                  },
                }),
              ]}
            >
              <Input
                className="signup-input form-input"
                type={!isNewPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="."
                suffix={
                  <>
                    <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="password">
                      {t(CONFIRM_NEW_PASSWORD)}
                    </label>
                    <EyeInvisibleOutlined onClick={onNewPasswordIconClick} />
                  </>
                }
              />
            </Form.Item>
            <Form.Item className="forget-pass-item">
              <Button type="primary" htmlType="submit" className="submit-button">
                {t(SAVE_PASSWORD)}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
