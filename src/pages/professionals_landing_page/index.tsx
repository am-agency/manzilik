import React, { FunctionComponent, useState } from 'react';
import { Container } from '../../components/container';
import { ProfessionalsLandingPageJoinUs } from './components/join_us';
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/lib/form/Form';
import { useMainContext } from '../../app/providers/main';
import { signInWithGoogle, signUpWithCognito } from '../auth/signup/api';
import { message } from 'antd';
import { getCognitoErrorMsgBasedOnLanguage } from '../../utils';
import { getLayoutDirection } from '../../app/layouts';
import { loginActionCreator } from '../../app/providers/main/actions';
import { ProfessionalsLandingFeatures } from './components/features';
import Separator from '../../components/separator';
import { ProfessionalsLandingWithManzilik } from './components/with_manzilik';
import { PROFESSIONAL } from '../../app/settings';
import { SignupParams } from '../auth/signup/types';
import * as analytics from '../../analytics';

const ProfessionalsLandingPage: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const [form] = useForm();
  const { dispatchUser } = useMainContext();
  const [formValues, setFormValues] = useState<SignupParams>();
  const { requestApi } = useMainContext();

  const onRegisterNewUser = (values: SignupParams) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestApi(signUpWithCognito, { ...values, role: PROFESSIONAL }, (response: any, error: string) => {
      if (error) {
        message.error({
          content: getCognitoErrorMsgBasedOnLanguage(error, t),
          className: getLayoutDirection(i18n.language),
        });
      } else {
        const { user } = response;
        dispatchUser(loginActionCreator(user, user['custom:user_group']));
        analytics.PublishEvent(new analytics.AnalyticsQuickProfessionalRegEvent());
      }
    });
  };

  const onGoogleLogin = () => {
    requestApi(signInWithGoogle);
  };

  return (
    <div className="professional-landing-header">
      <Container>
        <ProfessionalsLandingPageJoinUs
          form={form}
          onFinish={(values) => {
            setFormValues(values);
            onRegisterNewUser(values);
          }}
          onGoogleClick={onGoogleLogin}
          formValues={formValues!}
        />
      </Container>
      <Separator vertical={10} />
      <ProfessionalsLandingFeatures />
      <Separator vertical={10} />
      <ProfessionalsLandingWithManzilik
        form={form}
        onFinish={(values) => {
          setFormValues(values);
          onRegisterNewUser(values);
        }}
        onGoogleClick={onGoogleLogin}
        formValues={formValues!}
      />
    </div>
  );
};

export default ProfessionalsLandingPage;
