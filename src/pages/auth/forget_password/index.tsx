import { message } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getLayoutDirection } from '../../../app/layouts';
import { useMainContext } from '../../../app/providers/main';
import { User } from '../../../app/types';
import { getCognitoErrorMsgBasedOnLanguage } from '../../../utils';
import { forgetPasswordWithCognito } from './api';
import { ForgetPasswordForm } from './components/forget_password_form';
import { ForgetPasswordProps } from './types';

const ForgetPassword = () => {
  const history = useHistory();
  const { requestApi } = useMainContext();
  const { t, i18n } = useTranslation();

  const onFinish = (values: ForgetPasswordProps) => {
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
  };

  return <ForgetPasswordForm onFinish={onFinish} />;
};

export default ForgetPassword;
