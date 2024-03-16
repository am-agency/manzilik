import React, { useState } from 'react';
import { Col, Divider, FormInstance, Row, Typography } from 'antd';
import { LOGIN, SIGNUP_WITH } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import ConfirmCodeForm from '../../components/confirm_code_form';
import { LoginParams } from '../types';
import { CognitoForm } from '../../components/cognito_form';
import { FormFooter } from '../../components/form_footer';
import { SocialMediaLogin } from './social_media_login';
import { useMainContext } from '../../../../app/providers/main';

interface Props {
  onFinish: Function;
  setShowConfirm: Function;
  onGoogleLoginHandler: () => void;
  onFacebookLoginHandler: () => void;
  showConfirm: boolean;
  isSignupForm: boolean;
  onLoginForm: Function;
  formValues: LoginParams;
  form: FormInstance;
}

export const LoginForm: React.FunctionComponent<Props> = ({
  onFinish,
  onGoogleLoginHandler,
  onFacebookLoginHandler,
  showConfirm,
  setShowConfirm,
  isSignupForm,
  onLoginForm,
  formValues,
  form,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { userState } = useMainContext();

  return (
    <Row gutter={[10, 18]}>
      <Col
        xl={{ span: 12, offset: 0, order: 1 }}
        lg={{ span: 12, offset: 0, order: 1 }}
        md={{ span: 24, order: 1 }}
        sm={{ span: 24, order: 3 }}
        xs={{ span: 24, order: 3 }}
        className="email-login"
      >
        {!userState.isUserConfirmed && showConfirm ? (
          <>
            <ConfirmCodeForm values={formValues} showConfirm={showConfirm} setShowConfirm={setShowConfirm} />
          </>
        ) : (
          <div className="auth-form-wrapper">
            <Typography.Text className="title">{isSignupForm ? t(SIGNUP_WITH) : t(LOGIN)}</Typography.Text>
            <CognitoForm onFinish={onFinish} isSignupForm={isSignupForm} form={form} />
            <FormFooter isSignupForm={isSignupForm} onLoginForm={onLoginForm} />
          </div>
        )}
      </Col>
      <Col
        xl={{ span: 1, offset: 1, order: 2 }}
        lg={{ span: 1, offset: 0, order: 2 }}
        md={{ span: 1, offset: 0, order: 2 }}
        sm={0}
        xs={0}
      >
        <Divider type="vertical" orientation="center" />
      </Col>
      <SocialMediaLogin onGoogleLoginHandler={onGoogleLoginHandler} onFacebookLoginHandler={onFacebookLoginHandler} />
    </Row>
  );
};
