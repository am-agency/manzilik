import React, { FunctionComponent, useState } from 'react';
import { Container } from '../../components/container';
import { ClientsLandingPageSignUp } from './components/signup-content';
import { ClientsLandingPageSlider } from './components/slider';
import Separator from '../../components/separator';
import { ClientsLandingPageServices } from './components/services';
import { ClientsLandingPageWhithManzilik } from './components/with-manzilik';
import { signInWithGoogle, signUpWithCognito } from '../auth/signup/api';
import { useMainContext } from '../../app/providers/main';
import { useForm } from 'antd/lib/form/Form';
import { message } from 'antd';
import { getCognitoErrorMsgBasedOnLanguage } from '../../utils';
import { getLayoutDirection } from '../../app/layouts';
import { loginActionCreator } from '../../app/providers/main/actions';
import { useTranslation } from 'react-i18next';
import { HOMEOWNER } from '../../app/settings';
import { SignupParams } from '../auth/signup/types';

const ClientsLandingPage: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const [form] = useForm();
  const { userState, dispatchUser } = useMainContext();
  const [formValues, setFormValues] = useState<SignupParams>();
  const { requestApi } = useMainContext();

  const onRegisterNewUser = (values: SignupParams) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestApi(signUpWithCognito, { ...values, role: HOMEOWNER }, (response: any, error: string) => {
      if (error) {
        message.error({
          content: getCognitoErrorMsgBasedOnLanguage(error, t),
          className: getLayoutDirection(i18n.language),
        });
      } else {
        const { user, role } = response;
        dispatchUser(loginActionCreator(user, user['custom:user_group']));
      }
    });
  };

  const onGoogleLogin = () => {
    requestApi(signInWithGoogle);
  };

  return (
    <div className="landing-page-client">
      <div className={`client-page ${getLayoutDirection(i18n.language)}`} id="join-us">
        <Container>
          <ClientsLandingPageSignUp
            form={form}
            onFinish={(values) => {
              setFormValues(values);
              onRegisterNewUser(values);
            }}
            onGoogleClick={onGoogleLogin}
            formValues={formValues!}
          />
        </Container>
      </div>
      <Container>
        <ClientsLandingPageSlider />
        <ClientsLandingPageServices />
        <Separator vertical={45} />
        <ClientsLandingPageWhithManzilik
          form={form}
          onFinish={(values) => {
            setFormValues(values);
            onRegisterNewUser(values);
          }}
          onGoogleClick={onGoogleLogin}
          formValues={formValues!}
        />
      </Container>
    </div>
  );
};

export default ClientsLandingPage;
