import React, { useContext, useEffect, useState } from 'react';
import { Col, message, Row } from 'antd';
import { Auth } from 'aws-amplify';
import { signInWithFacebook, signInWithGoogle, signUpWithCognito } from '../signup/api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { loginWithCognito } from './api';
import { useTranslation } from 'react-i18next';
import { LOGIN as LOGIN_TEXT, LOGIN_SEO_DESCRIPTION, MANZILIK, MANZIL_LOGIN } from '../../../locales/strings';
import { LoginParams } from './types';
import { LoginForm } from './components/login_form';
import { useMainContext } from '../../../app/providers/main';
import { User, UserRole, userNotConfirmedException } from '../../../app/types';
import { checkAuthenticationDispatcher } from '../../../app/providers/user/with_user_authenticator';
import { FEDERATED_LOGIN_ROUTE, LOGIN_ROUTE, RESET_PASSWORD_ROUTE } from '../../../utils/routes';
import { checkRedirectSource, getCognitoErrorMsgBasedOnLanguage, setRedirectFrom } from '../../../utils';
import { UserExistsException } from './constants';
import { getLayoutDirection } from '../../../app/layouts';
import { loginActionCreator } from '../../../app/providers/main/actions';
import { LOGIN } from '../../../app/settings';
import { MetaTags } from '../../../components/meta_tags';
import { PASSWORD_RESET_REQUIRED } from '../../../locales/constants';
import { useForm } from 'antd/lib/form/Form';
import { forgetPasswordWithCognito } from '../forget_password/api';
import * as analytics from '../../../analytics';
import { PreviousHistoryContext } from '../../../context/previous_history_context';
import { useClient } from '../../../app/hooks/use_client';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import { usePersistedState } from '../../../hooks/usePersistedState';

const Login = () => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { userState, dispatchUser, requestApi } = useMainContext();
  const { pathname, state } = useLocation<{ from: string }>();
  const { screen: redirectSrc } = useParams<{ screen: string }>() || {};
  const [isSignupForm, setIsSignupForm] = useState<boolean>(true);
  const [formValues, setFormValues] = useState<LoginParams>();
  const screen = '/' + redirectSrc;
  const [form] = useForm();
  const { currentScreenName } = useContext(SharedStateContext) as SharedStateInterface;

  const { previousHistoryLink, setPreviousHistoryLink } = useContext(PreviousHistoryContext) as {
    previousHistoryLink: string;
    setPreviousHistoryLink?: (link: string) => void;
  };

  const onGoogleLoginHandler = () => {
    if (redirectSrc) {
      setRedirectFrom(redirectSrc);
    }
    requestApi(signInWithGoogle);
  };

  const redirectToPrevPage = () => {
    requestApi(checkRedirectSource, null, (redirectFrom: string) => {
      if (redirectFrom) {
        history.push(redirectFrom, { from: LOGIN_ROUTE });
      } else {
        history.push('/');
      }
    });
  };

  const onLoginForm = (value: string) => {
    if (value == LOGIN) {
      setIsSignupForm(false);
    } else {
      setIsSignupForm(true);
    }
  };

  useEffect(() => {
    if (pathname === FEDERATED_LOGIN_ROUTE) {
      Auth.currentAuthenticatedUser()
        .then()
        .catch(() =>
          message.error({
            className: getLayoutDirection(i18n.language),
            content: getCognitoErrorMsgBasedOnLanguage(UserExistsException, t),
          })
        );
      redirectToPrevPage();
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === LOGIN_ROUTE && !screen) {
      if (!userState.isAuthenticated) {
        requestApi(checkAuthenticationDispatcher, dispatchUser, () => {});
      } else {
        history.push('/');
      }
    }
  }, [userState.isAuthenticated]);

  const onFacebookLoginHandler = () => {
    if (redirectSrc) {
      setRedirectFrom(redirectSrc);
    }
    requestApi(signInWithFacebook);
  };

  const onFinish = async (values: LoginParams, type?: string) => {
    setFormValues(values);
    if (!isSignupForm) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestApi(loginWithCognito, values, (result: any, error: string) => {
        const { user } = result;
        if (error) {
          message.error({
            content: getCognitoErrorMsgBasedOnLanguage(error, t),
            className: getLayoutDirection(i18n.language),
          });
          if (error.includes(userNotConfirmedException)) {
            setShowConfirm(true);
          }
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
        } else {
          localStorage.setItem(
            'isProf',
            JSON.stringify(user?.attributes?.['custom:user_group'] === UserRole.Professional)
          );
          analytics.PublishEvent(new analytics.AnalyticsLoginEvent());
          if (previousHistoryLink.includes('request-gig-service')) {
            analytics.PublishEvent(new analytics.AnalyticsLoginGig('email/phone', currentScreenName));
          }

          if (redirectSrc) {
            history.push(screen, { from: LOGIN_ROUTE });

            return;
          }
          const userFromResult = {
            ...user?.attributes,
            userConfirmed: true,
          };
          history.push(previousHistoryLink || '/');
          window.location.reload();
          setPreviousHistoryLink!('/');
          dispatchUser(loginActionCreator(userFromResult, user?.attributes['custom:user_group']));
        }
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestApi(signUpWithCognito, values, (response: any, error: string) => {
        if (error) {
          message.error({
            content: getCognitoErrorMsgBasedOnLanguage(error, t),
            className: getLayoutDirection(i18n.language),
          });
        } else {
          setShowConfirm(true);
          localStorage.setItem('cognitoUser', JSON.stringify(response.user));
          analytics.PublishEvent(new analytics.AnalyticsSignupEvent());
          if (previousHistoryLink.includes('request-gig-service')) {
            analytics.PublishEvent(new analytics.AnalyticsSignUpGig('email/phone', currentScreenName));
          }
        }
      });
    }
  };

  return (
    <Row justify="center" align="middle" className="login form normal-switch ">
      <MetaTags title={` ${t(MANZILIK)} | ${t(LOGIN_TEXT)}`} description={LOGIN_SEO_DESCRIPTION} />
      <Col span={19}>
        <LoginForm
          onFinish={onFinish}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          onGoogleLoginHandler={onGoogleLoginHandler}
          onFacebookLoginHandler={onFacebookLoginHandler}
          isSignupForm={isSignupForm}
          onLoginForm={onLoginForm}
          formValues={formValues!}
          form={form}
        />
      </Col>
    </Row>
  );
};

export default Login;
