import React, { FunctionComponent } from 'react';
import { Button, Col, FormInstance, Row, Typography } from 'antd';
import sofa from '../../../../assets/images/landing_page/professionals_landing_page_sofa.png';
import {
  LOGIN_WITH_GOOGLE,
  WE_PROVIDE_PLATFORM_TO_DISPLAY_YOUR_BUSINESS,
  WITH_MANZILIK,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../components/separator';
import { landingPagesIcons } from '../../../../assets/icons/landing-pages';
import { ProfessionalsLandingPageJoinUsConfirmForm } from '../confirm_form';
import { ProfessionalsLandingPageJoinUsForm } from '../join_us_form';
import { useMainContext } from '../../../../app/providers/main';
import { SignupParams } from '../../../auth/signup/types';

interface Props {
  onFinish: (values: SignupParams) => void;
  onGoogleClick: () => void;
  form?: FormInstance;
  formValues: SignupParams;
}

export const ProfessionalsLandingWithManzilik: FunctionComponent<Props> = (props: Props) => {
  const { onGoogleClick, formValues, form, onFinish } = props;
  const { userState } = useMainContext();
  const { isUserConfirmed, isAuthenticated } = userState;
  const { t } = useTranslation();

  return (
    <Row justify="center" align="middle" className="professional-landing-with-manzilik">
      <Col xl={12} lg={18} md={20} sm={22} xs={22}>
        <div className="professional-landing-sofa">
          <img src={sofa} alt="sofa" />
        </div>
        <Separator horizontal={20} />
      </Col>
      <Col xl={10} lg={18} md={20} sm={22} xs={22} className="with-manzilik-form">
        <div className="with-manzilik-title-container">
          <div className="with-manzilik-title">
            <h3>{t(WITH_MANZILIK)}</h3>
            <Typography.Text>{t(WE_PROVIDE_PLATFORM_TO_DISPLAY_YOUR_BUSINESS)}</Typography.Text>
            <Separator horizontal={20} />
          </div>
        </div>
        <div className="with-manzilik-form-container">
          {!isUserConfirmed && isAuthenticated ? (
            <ProfessionalsLandingPageJoinUsConfirmForm values={formValues} />
          ) : (
            <ProfessionalsLandingPageJoinUsForm onFinish={onFinish} form={form} onGoogleClick={onGoogleClick} />
          )}
        </div>
      </Col>
    </Row>
  );
};
