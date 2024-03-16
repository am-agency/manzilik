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
import { confirmCodeActionCreator } from '../../../../app/providers/main/actions';
// components
import ResendConfirmationCodeForm from '../../../auth/components/resend_confirmation_form';
import { Button, Col, Form, Input, message, Row, Typography } from 'antd';
// constants
import { SUCCESS } from '../../../projects/constants';
import { UserRole } from '../../../../app/types';
import { CognitoUserExt, SignupParams } from '../../../auth/signup/types';
import { getCognitoErrorMsgBasedOnLanguage } from '../../../../utils';
import { getLayoutDirection } from '../../../../app/layouts';
import Separator from '../../../../components/separator';
import { ConfirmCodeParams } from '../../../auth/components/confirm_code_form';

interface Props {
  values?: SignupParams;
  setShowConfirm?: Function;
}
export const ClientsLandingPageSignUpFormConfirmation: FunctionComponent<Props> = (props: Props) => {
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
        dispatchUser(confirmCodeActionCreator());
        requestApi(loginWithCognito, props.values, (result: { user: CognitoUserExt }, error: string) => {
          if (error) {
            return;
          }
          if (result) {
            dispatchUser(confirmCodeActionCreator());
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
    <Row justify="end" className="signup-form">
      <Col xl={20} lg={23} md={24} sm={24} xs={24}>
        <Form className="form confirm-form" layout="horizontal" onFinish={onConfirmCode}>
          <Form.Item className="custom-ant-input" name="code">
            <Input placeholder={t(CONFIRMATION_CODE)} type="tel" className="signup-input" />
          </Form.Item>
          <Form.Item className="submit-button-item">
            <Typography.Link onClick={onResendCode}>{t(RESEND_CONFIRMATION)}</Typography.Link>
            <Separator vertical={15} />
          </Form.Item>
          <Form.Item className="submit-button-item">
            <Button type="primary" htmlType="submit">
              {t(CONFIRM)}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={24}>
        {setShowConfirm && (
          <Typography.Link className="confirm-text" onClick={() => setShowConfirm(false)}>
            {t(BACK_TO_LOGIN)}
          </Typography.Link>
        )}
      </Col>
    </Row>
  );
};
