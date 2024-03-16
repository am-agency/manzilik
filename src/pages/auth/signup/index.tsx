import { Col, message, Row, Typography } from 'antd';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { signInWithFacebook, signInWithGoogle, signUpWithCognito } from './api';

import ConfirmCodeForm from '../components/confirm_code_form';

import { loginActionCreator } from '../../../app/providers/main/actions';
import { useMainContext } from '../../../app/providers/main';
import { CognitoAndSocialMediaForm } from '../components/cognito_and_social_media_form';
import { HOME_PAGE_HEADING } from '../../../locales/strings';
import { useForm } from 'antd/lib/form/Form';
import { getCognitoErrorMsgBasedOnLanguage } from '../../../utils';
import { getLayoutDirection } from '../../../app/layouts';
import { LOGIN } from '../../../app/settings';
import { loginWithCognito } from '../login/api';
import { useHistory } from 'react-router';
import { SignupParams } from './types';
import { PASSWORD_RESET_REQUIRED } from '../../../locales/constants';
import { User, userNotConfirmedException } from '../../../app/types';
import { forgetPasswordWithCognito } from '../forget_password/api';
import { useLocation } from 'react-router-dom';

const SignUpWithEmail: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { userState, dispatchUser } = useMainContext();
  const { isUserConfirmed, isAuthenticated } = userState;
  const history = useHistory();
  const [formValues, setFormValues] = useState<SignupParams>();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [form] = useForm();
  const { requestApi } = useMainContext();
  const [isSignupForm, setIsSignupForm] = useState<boolean>(true);
  const { search } = useLocation();
  const referralCode = new URLSearchParams(search).get('referral_code');

  const onFinish = (values: SignupParams) => {
    if (isSignupForm) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestApi(signUpWithCognito, values, (response: any, error: string) => {
        if (error) {
          message.error({
            content: getCognitoErrorMsgBasedOnLanguage(error, t),
            className: getLayoutDirection(i18n.language),
          });
        } else {
          const { user } = response;
          dispatchUser(loginActionCreator(user, user['custom:user_group']));
        }
      });
    } else {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestApi(loginWithCognito, values, (result: any, error: string) => {
        const { user } = result;
        if (error) {
          message.error({
            content: getCognitoErrorMsgBasedOnLanguage(error, t),
            className: getLayoutDirection(i18n.language),
          });

          if (error.includes(PASSWORD_RESET_REQUIRED)) {
            requestApi(forgetPasswordWithCognito, values, (response: User, error: string) => {
              if (error) {
                message.error({
                  content: getCognitoErrorMsgBasedOnLanguage(error, t),
                  className: getLayoutDirection(i18n.language),
                });
                return;
              }
              history.push(`/reset-new-password/username=${values.username}`);
            });
          }

          if (error.includes(userNotConfirmedException)) {
            setShowConfirm(true);
          }
        } else {
          const userFromResult = {
            ...user?.attributes,
            userConfirmed: true,
          };
          history.push('/');
          dispatchUser(loginActionCreator(userFromResult, user?.attributes['custom:user_group']));
        }
      });
    }
  };

  const onGoogleLogin = () => {
    requestApi(() => signInWithGoogle(referralCode!));
  };

  const onFacebookLogin = () => {
    requestApi(signInWithFacebook);
  };

  const onLoginForm = (value: string) => {
    if (value == LOGIN) {
      setIsSignupForm(false);
    } else {
      setIsSignupForm(true);
    }
  };

  return (
    <Row justify="space-between">
      <Col xl={11} lg={12} md={10} xs={20} sm={20}>
        <h1 className="heading-text">{t(HOME_PAGE_HEADING)}</h1>
      </Col>
      <Col xl={11} lg={11} md={14} xs={0} sm={0}>
        <Row className="signup-form-container normal-switch" align="middle">
          {(!isUserConfirmed && isAuthenticated) || showConfirm ? (
            <ConfirmCodeForm values={formValues} showConfirm={showConfirm} setShowConfirm={setShowConfirm} />
          ) : (
            <CognitoAndSocialMediaForm
              form={form}
              onFinish={(values) => {
                setFormValues(values);
                onFinish(values);
              }}
              onFacebookClick={onFacebookLogin}
              onGoogleClick={onGoogleLogin}
              isSignupForm={isSignupForm}
              onLoginForm={onLoginForm}
            />
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default SignUpWithEmail;
