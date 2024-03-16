import React, { FunctionComponent } from 'react';
import { Row, Typography } from 'antd';
import Separator from '../../../../components/separator';
import { HAVE_ACCOUNT, LOGIN, NO, SIGNUP_WITH_EMAIL } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface Props {
  isSignupForm: boolean;
  onLoginForm: Function;
}
export const FormFooter: FunctionComponent<Props> = ({ isSignupForm, onLoginForm }: Props) => {
  const { t } = useTranslation();

  return (
    <Row justify="center">
      <div>
        <Separator vertical={8} />
        {!isSignupForm && <span className="account-text">{t(NO)} </span>}
        <Typography.Text className="account-text">{t(HAVE_ACCOUNT)}</Typography.Text>
        &nbsp;&nbsp;
        <span className="link clickable" onClick={() => onLoginForm(isSignupForm ? 'login' : 'signup')}>
          {!isSignupForm ? t(SIGNUP_WITH_EMAIL) : t(LOGIN)}
        </span>
      </div>
    </Row>
  );
};
