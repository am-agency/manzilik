import React, { FunctionComponent } from 'react';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { EMAIL, RESEND_CONFIRMATION } from '../../../../locales/strings';
import { required } from '../../../projects/add_new_project';

interface Props {
  onResendConfirmation: (values: { username: string }) => void;
}

const ResendConfirmationCodeForm: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { onResendConfirmation } = props;

  return (
    <Form onFinish={onResendConfirmation} className="resend-code-container">
      <Form.Item name="username" rules={[required]}>
        <Input placeholder={t(EMAIL)} type="email" className="signup-input" />
      </Form.Item>
      <Button type="primary" htmlType="submit" className="social-btn">
        {t(RESEND_CONFIRMATION)}
      </Button>
    </Form>
  );
};

export default ResendConfirmationCodeForm;
