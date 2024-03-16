import React, { FunctionComponent, useState } from 'react';
// strings
import {
  BACK_TO_LOGIN,
  CONFIRM,
  CONFIRM_EMAIL,
  CONFIRMATION_CODE,
  RESEND_CONFIRMATION,
} from '../../../../locales/strings';
// hooks
import { useMainContext } from '../../../../app/providers/main';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// api
import { confirmCode, resendSignupCode } from '../../../auth/signup/api';
import { loginWithCognito } from '../../../auth/login/api';
import { confirmCodeActionCreator, loginActionCreator } from '../../../../app/providers/main/actions';
// components
import ResendConfirmationCodeForm from '../../../auth/components/resend_confirmation_form';
import { Button, Col, Form, Input, message, Row, Typography } from 'antd';
// constants
import { SUCCESS } from '../../../projects/constants';
import { User, UserRole } from '../../../../app/types';

import { CognitoUserExt, SignupParams } from '../../../auth/signup/types';
import { getCognitoErrorMsgBasedOnLanguage } from '../../../../utils';
import { getLayoutDirection } from '../../../../app/layouts';
import Separator from '../../../../components/separator';
import { required } from '../../../projects/add_new_project';
import * as analytics from '../../../../analytics';
//@TODO: will combine this code with the form was used in signup after finish the edits on signup form

export interface ConfirmCodeParams {
  code: string;
}
interface Props {
  values?: SignupParams;
  setShowConfirm?: Function;
}

export const ProfessionalsLandingPageJoinUsConfirmForm: FunctionComponent<Props> = (props: Props) => {
  const { t, i18n } = useTranslation();
  const { dispatchUser, requestApi } = useMainContext();
  const [isResendCode, setResendCode] = useState<boolean>(false);
  const { setShowConfirm } = props;

  const history = useHistory();

  const onConfirmCode = (values: ConfirmCodeParams) => {
    const { code } = values;
    requestApi(confirmCode, { username: props.values?.username, code }, (response: string, error: string) => {
      if (error) {
        message.error({
          content: getCognitoErrorMsgBasedOnLanguage(error, t),
          className: getLayoutDirection(i18n.language),
        });
      }
      if (response === SUCCESS) {
        analytics.PublishEvent(new analytics.AnalyticsSuccessQuickRegEvent());
        requestApi(loginWithCognito, props.values, (result: { user: CognitoUserExt }, error: string) => {
          if (error) {
            return;
          }
          if (result) {
            const userRole = result?.user?.attributes?.['custom:user_group'] as UserRole;
            const user: User = {
              username: result.user.attributes.sub,
              email: result.user.attributes.email,
              name: result.user.attributes.name,
              family_name: '',
              last_name: '',
              sub: result.user.attributes.sub,
              isUserLoaded: true,
              type: (result.user as unknown as User).type,
            };
            dispatchUser(loginActionCreator(user, userRole));
            dispatchUser(confirmCodeActionCreator());
            setShowConfirm?.(false);
            history.push('/');
          }
        });
      }
    });
  };

  const onResendConfirmation = (values: { username: string }) => {
    requestApi(resendSignupCode, values?.username, () => {
      setResendCode(false);
    });
  };

  const onResendCode = () => {
    setResendCode(true);
  };

  if (isResendCode) {
    return (
      <>
        <ResendConfirmationCodeForm onResendConfirmation={onResendConfirmation} />
        <Typography.Link className="confirm-text" onClick={() => setResendCode(false)}>
          {t(CONFIRM_EMAIL)}
        </Typography.Link>
      </>
    );
  }

  return (
    <Row justify="center" gutter={[16, 16]}>
      <Form className="professional-landing-confirm-form" layout="horizontal" onFinish={onConfirmCode}>
        <Col xl={16} lg={16} md={16} sm={20} xs={20}>
          <Form.Item rules={[required]} className="custom-ant-input" name="code">
            <Input placeholder={t(CONFIRMATION_CODE)} type="tel" className="signup-input" />
          </Form.Item>
        </Col>
        <Col xl={8} lg={8} md={8} sm={20} xs={20}>
          <Form.Item className="submit-button-item">
            <Button type="primary" htmlType="submit">
              {t(CONFIRM)}
            </Button>
          </Form.Item>
        </Col>
        <Col xl={10} lg={10} md={8} sm={20} xs={20} className="professional-landing-confirm-text">
          <Typography.Link onClick={onResendCode}>{t(RESEND_CONFIRMATION)}</Typography.Link>
          <Separator vertical={15} />
        </Col>
        <Col span={24}>
          {setShowConfirm && (
            <Typography.Link className="confirm-text" onClick={() => setShowConfirm(false)}>
              {t(BACK_TO_LOGIN)}
            </Typography.Link>
          )}
        </Col>
      </Form>
    </Row>
  );
};
