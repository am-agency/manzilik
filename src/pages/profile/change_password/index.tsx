import { Button, Col, Form, Input, message, Row } from 'antd';
import { Auth } from 'aws-amplify';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { useMainContext } from '../../../app/providers/main';
import { logoutActionCreator } from '../../../app/providers/main/actions';
import { withUserAuthenticator } from '../../../app/providers/user/with_user_authenticator';

import {
  HELLO,
  RE_ENTER_PASSWORD,
  SUBMIT,
  NEW_PASSWORD_TERMS,
  PASSWORD_DONT_MATCH,
  CREATE_NEW_PASSWORD,
  PASSWORD_REQUIRED_MESSAGE,
  REGEX_DOESNT_MATCH_MSG,
  NEW_PASSWORD,
} from '../../../locales/strings';
import { SUCCESS } from '../../projects/constants';
import { changePassword } from '../../auth/signup/api';
import { PASSWORD_REGEX } from '../../auth/signup/constants';
import { LOGIN_ROUTE } from '../../../utils/routes';
import { CHANGE_PASSWORD } from '../../../app/settings';
import { getLayoutDirection } from '../../../app/layouts';
import i18n from '../../../app/i18n';
import { getCognitoErrorMsgBasedOnLanguage } from '../../../utils';

interface FormState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { requestApi, dispatchUser, userName } = useMainContext();
  const { state } = useLocation<{ from: string }>();
  const history = useHistory();

  useEffect(() => {
    if (state?.from !== LOGIN_ROUTE) {
      history.push(LOGIN_ROUTE + '/from=' + CHANGE_PASSWORD, { from: CHANGE_PASSWORD });
    }
    localStorage.removeItem('redirectFrom');
  }, []);

  const onFinish = async (values: FormState) => {
    const user = await Auth.currentUserPoolUser();
    requestApi(
      changePassword,
      {
        user: user,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      (result: string, error: string) => {
        if (error) {
          message.error({
            content: getCognitoErrorMsgBasedOnLanguage(error, t),
            className: getLayoutDirection(i18n.language),
          });
        }
        if (result === SUCCESS) {
          dispatchUser(logoutActionCreator());
        }
      }
    );
  };
  return (
    <Row justify="center" className="form reset-password">
      <Col xl={10} lg={10} md={14} sm={22} xs={22} className="forget-password">
        <h4 className="title">{t(CREATE_NEW_PASSWORD)}</h4>
        <p className="description">
          <span className="hello-text">
            {t(HELLO)} {userName}
          </span>
          <br />
          <span className="password-regex-msg">{t(REGEX_DOESNT_MATCH_MSG)}</span>
        </p>
        <Form name="basic" onFinish={(values) => onFinish(values)}>
          <span>{t('OLD_PASSWORD')}</span>
          <Form.Item
            name="oldPassword"
            rules={[
              { required: true, message: t(PASSWORD_REQUIRED_MESSAGE) },
              {
                pattern: PASSWORD_REGEX,
                message: t(REGEX_DOESNT_MATCH_MSG),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <span>{t(NEW_PASSWORD)}</span>
          <Form.Item
            name="newPassword"
            validateTrigger="onChange"
            rules={[
              { required: true, message: t(PASSWORD_REQUIRED_MESSAGE) },
              {
                pattern: PASSWORD_REGEX,
                message: t(REGEX_DOESNT_MATCH_MSG),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <span>{t(RE_ENTER_PASSWORD)}</span>
          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            validateTrigger="onChange"
            rules={[
              { required: true, message: t(PASSWORD_REQUIRED_MESSAGE) },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t(PASSWORD_DONT_MATCH)));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="forget-pass-item">
            <Button type="primary" htmlType="submit" className="submit-button">
              {t(SUBMIT)}
            </Button>
          </Form.Item>
          <p className="description terms-description">{t(NEW_PASSWORD_TERMS)}</p>
        </Form>
      </Col>
    </Row>
  );
};

export default withUserAuthenticator(ChangePassword, undefined);
