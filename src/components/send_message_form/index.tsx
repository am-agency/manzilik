import { Col, Form, FormInstance, Input, message, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ResultOutput, SendEmailInput } from '../../API';
import i18n from '../../app/i18n';
import { getLayoutDirection } from '../../app/layouts';
import { sendEmail } from '../../app/providers/api';
import { useMainContext } from '../../app/providers/main';
import {
  ENTER_EMAIL_RECIPIENTS,
  MESSAGE_SUBJECT,
  MESSAGE,
  MESSAGE_INPUT_PLACE_HOLDER,
  MESSAGE_IS_SENT,
  TO,
  PLEASE_WRITE_VALID_EMAILS,
} from '../../locales/strings';
import { required } from '../../pages/projects/add_new_project';
import { DONE } from '../../pages/projects/constants';
import { EMAIL_REGEX } from '../../pages/auth/signup/constants';
import { BaseEntity, Project } from '../idea/types';
import * as analytics from '../../analytics';
import { useClient } from '../../app/hooks/use_client';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

interface Props {
  project?: Project;
  form?: FormInstance;
  idea?: BaseEntity;
  defaultMessageContent?: string;
  email?: string;
  sendToProfessional?: boolean;
  shareItem?: analytics.AnalyticsShareItemEventParams['item'];
}

const SendMessageForm: FunctionComponent<Props> = (props: Props) => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;

  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { email = '', defaultMessageContent } = props;

  const isEmailFixed = !!email;

  const onSendEmail = (values: SendEmailInput) => {
    const { subject, email, body } = values;
    const urlRegex = /(https?:\/\/[^ ]*)/;
    const url = values.body?.match(urlRegex)!;
    const defaultBody = url && body.replace(url[0], encodeURI(url[0]));
    requestApi(sendEmail, { subject, email, body: defaultBody || body }, (result: ResultOutput, error: string) => {
      if (error) {
        return;
      }

      if (result.message === DONE) {
        message.success({ content: t(MESSAGE_IS_SENT), className: `${getLayoutDirection(i18n.language)}` });
        if (props.sendToProfessional) {
          analytics.PublishEvent(new analytics.AnalyticsMessageProfessionalEvent(email, client?.id!));
        } else if (props.shareItem) {
          analytics.PublishEvent(new analytics.AnalyticsShareItemEvent(props.shareItem));
        }
      }
    });
  };

  useEffect(() => {
    props.form!.setFieldsValue({ subject: '', email: isEmailFixed ? email : '', body: defaultMessageContent });
  }, [defaultMessageContent, email]);

  return (
    <Form
      form={props.form}
      layout="horizontal"
      validateTrigger="onSubmit"
      className="general-form"
      onFinish={onSendEmail}
    >
      <Typography.Text>
        <span className="to">{t(TO)} </span> {t(ENTER_EMAIL_RECIPIENTS)}
      </Typography.Text>
      <Form.Item
        name="email"
        initialValue={isEmailFixed ? email : ''}
        rules={[
          required,
          ({ getFieldValue }) => ({
            validator(_, value) {
              const allEmails: string[] = getFieldValue('email').split(',');
              let error: boolean | null = null;
              allEmails.map((email) => {
                if (!EMAIL_REGEX.test(email)) {
                  error = true;
                }
              });
              if (!error) {
                return Promise.resolve();
              } else {
                return Promise.reject(new Error(t(PLEASE_WRITE_VALID_EMAILS)));
              }
            },
          }),
        ]}
        validateTrigger="onSubmit"
        className="title-item"
        dependencies={['email']}
      >
        <Input disabled={isEmailFixed!} />
      </Form.Item>
      <Form.ErrorList errors={[]}></Form.ErrorList>
      <Typography.Text>
        <span className="to">{t(MESSAGE_SUBJECT)}</span>
      </Typography.Text>
      <Form.Item className="margin-bottom-20" name="subject" rules={[required]}>
        <Input />
      </Form.Item>
      <Typography.Text>
        <span className="to">{t(MESSAGE)}</span>
      </Typography.Text>
      <Form.Item
        dependencies={['body']}
        className="margin-bottom-20"
        name="body"
        rules={[required]}
        initialValue={defaultMessageContent}
      >
        <TextArea placeholder={t(MESSAGE_INPUT_PLACE_HOLDER)} />
      </Form.Item>
    </Form>
  );
};

export default SendMessageForm;
