import React, { FunctionComponent } from 'react';
import { Col, FormInstance, Row, Typography } from 'antd';
import landingPageSofa from '../../../../assets/backgrounds/landing_page_sofa2.png';
import {
  INSPIRE_YOURSELF,
  WANT_TO_CHANGE_YOUR_HOME_DECORE,
  WE_PROVIDE_COMPLETE_FEED_OF_IDEAS,
  WITH_MANZILIK,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { ClientsLandingPageSignUpForm } from '../signup-form';
import { ClientsLandingPageSignUpFormConfirmation } from '../confirm-form';
import { useMainContext } from '../../../../app/providers/main';
import { SignupParams } from '../../../auth/signup/types';

interface Props {
  onFinish: (values: SignupParams) => void;
  onGoogleClick: () => void;
  form?: FormInstance;
  formValues: SignupParams;
}

export const ClientsLandingPageWhithManzilik: FunctionComponent<Props> = (props: Props) => {
  const { onFinish, onGoogleClick, form, formValues } = props;
  const { userState } = useMainContext();
  const { t } = useTranslation();
  const { isUserConfirmed, isAuthenticated } = userState;

  return (
    <Row gutter={[8, 26]} justify="center" className="with-manzilik">
      <Col xl={13} lg={13} md={24} sm={24} xs={24}>
        <div className="header-sofa">
          <img src={landingPageSofa} alt="sofa" />
        </div>
      </Col>
      <Col xl={11} lg={11} md={18} sm={24} xs={24} className="with-manzilik-client-content">
        <Row justify="end">
          <Col xl={20} lg={23} md={24} sm={24} xs={24} className="with-manzilik-client-title">
            <h3>{t(WITH_MANZILIK)}</h3>
            <Typography.Text>{t(INSPIRE_YOURSELF)}</Typography.Text>
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
