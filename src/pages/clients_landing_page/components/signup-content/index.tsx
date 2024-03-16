import React, { FunctionComponent } from 'react';
import { Col, FormInstance, Row, Typography } from 'antd';
import landingPageSofa1 from '../../../../assets/backgrounds/landing_page_sofa1.png';
import { WANT_TO_CHANGE_YOUR_HOME_DECORE, WE_PROVIDE_COMPLETE_FEED_OF_IDEAS } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { ClientsLandingPageSignUpForm } from '../signup-form';
import { ClientsLandingPageSignUpFormConfirmation } from '../confirm-form';
import { useMainContext } from '../../../../app/providers/main';
import { SignupParams } from '../../../auth/signup/types';

interface Props {
  onFinish: (values: SignupParams) => void;
  onGoogleClick: () => void;
  form?: FormInstance;
  formValues?: SignupParams;
}

export const ClientsLandingPageSignUp: FunctionComponent<Props> = (props: Props) => {
  const { onFinish, onGoogleClick, form, formValues } = props;
  const { userState } = useMainContext();
  const { t } = useTranslation();
  const { isUserConfirmed, isAuthenticated } = userState;

  return (
    <Row justify="space-between" className="client-page-signup-content">
      <Col xl={14} lg={12} md={20} sm={24} xs={24}>
        <div className="landing-header-sofa">
          <img src={landingPageSofa1} alt="sofa" />
        </div>
      </Col>
      <Col xl={10} lg={12} md={20} sm={24} xs={24} className="signup-content-title">
        <Row justify="end">
          <Col xl={20} lg={23} md={24} sm={24} xs={24}>
            <h3>{t(WANT_TO_CHANGE_YOUR_HOME_DECORE)}</h3>
            <Typography.Text>{t(WE_PROVIDE_COMPLETE_FEED_OF_IDEAS)}</Typography.Text>
          </Col>
        </Row>
        {!isUserConfirmed && isAuthenticated ? (
          <ClientsLandingPageSignUpFormConfirmation values={formValues} />
        ) : (
          <ClientsLandingPageSignUpForm onGoogleClick={onGoogleClick} form={form} onFinish={onFinish} />
        )}
      </Col>
    </Row>
  );
};
