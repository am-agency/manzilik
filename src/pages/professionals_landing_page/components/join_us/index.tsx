import React, { FunctionComponent } from 'react';
import { Button, Col, FormInstance, Row, Typography } from 'antd';
import { landingPageImages } from '../../../../assets/images/landing_page';
import {
  DO_YOU_WANT_TO_EXPAND_CUSTOMER_INCREASE,
  LOGIN_WITH_GOOGLE,
  WE_PROVIDE_PLATFORM_TO_DISPLAY_YOUR_BUSINESS,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { landingPagesIcons } from '../../../../assets/icons/landing-pages';
import message from '../../../../assets/images/message.png';
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

export const ProfessionalsLandingPageJoinUs: FunctionComponent<Props> = (props: Props) => {
  const { onFinish, onGoogleClick, form, formValues } = props;
  const { userState } = useMainContext();
  const { isUserConfirmed, isAuthenticated } = userState;
  const { t } = useTranslation();

  return (
    <Row justify="center" className="join-us">
      <Col xl={19} lg={19} md={22} sm={24} xs={24}>
        <div className="join-us-content">
          <div className="professional-image-container-1">
            <img src={landingPageImages.professionalsUserImage2} alt="user image" />
          </div>
          <div className="join-us-title">
            <h3>{t(DO_YOU_WANT_TO_EXPAND_CUSTOMER_INCREASE)}</h3>
            <Typography.Text>{t(WE_PROVIDE_PLATFORM_TO_DISPLAY_YOUR_BUSINESS)}</Typography.Text>
          </div>
          <div className="professional-image-container-2">
            <img src={landingPageImages.professionalsUserImage1} alt="user image" />
          </div>
        </div>
      </Col>
      <Col xl={0} lg={0} md={20} sm={20} xs={20} className="hidden-text">
        <Typography.Text>{t(WE_PROVIDE_PLATFORM_TO_DISPLAY_YOUR_BUSINESS)}</Typography.Text>
      </Col>
      <Col xl={15} lg={19} md={22} sm={24} xs={24} className="form-container">
        {!isUserConfirmed && isAuthenticated ? (
          <ProfessionalsLandingPageJoinUsConfirmForm values={formValues} />
        ) : (
          <ProfessionalsLandingPageJoinUsForm onFinish={onFinish} form={form} onGoogleClick={onGoogleClick} />
        )}
      </Col>
      <div className="message-container">
        <div className="message-img">
          <img src={message} alt="message" />
        </div>
      </div>
    </Row>
  );
};
