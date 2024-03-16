import React, { FunctionComponent } from 'react';
import { Col, Divider, FormInstance, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { LOGIN, OR, SIGNUP_WITH } from '../../../../locales/strings';
import { CognitoForm } from '../cognito_form';
import { SocialMediaLogin } from '../../signup/components/social_media';
import { FormFooter } from '../form_footer';
import { SignupParams } from '../../signup/types';

interface Props {
  onFinish: (values: SignupParams) => void;
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  form?: FormInstance;
  onLoginForm: (value: string) => void;
  isSignupForm: boolean;
}

export const CognitoAndSocialMediaForm: FunctionComponent<Props> = (props: Props) => {
  const { onFinish, onFacebookClick, onGoogleClick, isSignupForm, onLoginForm, form } = props;
  const { t, i18n } = useTranslation();

  return (
    <>
      <Col span={24}>
        <Typography.Text className="home-auth-title">{isSignupForm ? t(SIGNUP_WITH) : t(LOGIN)}</Typography.Text>
      </Col>
      <SocialMediaLogin onFacebookClick={onFacebookClick} onGoogleClick={onGoogleClick} />
      <Divider>{t(OR)}</Divider>
      <Col span={24}>
        <CognitoForm onFinish={onFinish} isSignupForm={isSignupForm} form={form} />
        <FormFooter isSignupForm={isSignupForm} onLoginForm={onLoginForm} />
      </Col>
    </>
  );
};
