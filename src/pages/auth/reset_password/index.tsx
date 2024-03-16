import { message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { getLayoutDirection } from '../../../app/layouts';
import { useMainContext } from '../../../app/providers/main';
import { User } from '../../../app/types';
import { RESET_PASSWORD_SUCCESS_MSG } from '../../../locales/strings';
import { getCognitoErrorMsgBasedOnLanguage } from '../../../utils';
import { LOGIN_ROUTE } from '../../../utils/routes';
import { resetNewPassword } from './api';
import { ResetPasswordForm } from './components/reset_password_form';
import { ResetNewPassword } from './types';

interface UrlParams {
  username: string;
}

const ResetPassword = () => {
  const history = useHistory();
  const { requestApi } = useMainContext();
  const { username }: UrlParams = useParams();
  const { t, i18n } = useTranslation();

  const onFinish = (values: ResetNewPassword) => {
    requestApi(resetNewPassword, { ...values, username }, (response: User, error: string) => {
      if (error) {
        message.error({
          content: getCognitoErrorMsgBasedOnLanguage(error, t),
          className: getLayoutDirection(i18n.language),
        });
        return;
      }
      message.success({ content: t(RESET_PASSWORD_SUCCESS_MSG), className: getLayoutDirection(i18n.language) });
      history.push(LOGIN_ROUTE);
    });
  };

  return <ResetPasswordForm onFinish={onFinish} />;
};

export default ResetPassword;
