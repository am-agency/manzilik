import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import ReactCodeInput from 'react-verification-code-input';
// strings
import { CONFIRM, RESEND_CONFIRMATION, SEND_CONFIRMATION_CODE } from '../../../../locales/strings';
import { CONFIRM_CODE_TITLE } from '../../../../locales/strings';
// hooks
import { useMainContext } from '../../../../app/providers/main';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// api
import { confirmCode, resendSignupCode } from '../../signup/api';
import { loginWithCognito } from '../../login/api';
import { confirmCodeActionCreator, loginActionCreator } from '../../../../app/providers/main/actions';
// components
import { Button, Form, message, Typography } from 'antd';
// constants
import { SUCCESS } from '../../../projects/constants';
import { User, UserRole } from '../../../../app/types';
import { CognitoUserExt, SignupParams } from '../../signup/types';
import { getCognitoErrorMsgBasedOnLanguage } from '../../../../utils';
import { getLayoutDirection } from '../../../../app/layouts';
import Separator from '../../../../components/separator';
import * as analytics from '../../../../analytics';

//@TODO: will combine this code with the form was used in signup after finish the edits on signup form
export interface ConfirmCodeParams {
  code: string;
}

interface Props {
  values?: SignupParams;
  setShowConfirm?: Function;
  showConfirm: boolean;
}
interface Ref {
  current: ReactCodeInput | null;
}

const ConfirmCodeForm: FunctionComponent<Props> = (props: Props) => {
  const { values, showConfirm, setShowConfirm } = props;
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { dispatchUser, requestApi } = useMainContext();
  const [isCompleted, setIsCompleted] = useState(false);
  const [code, setCode] = useState<string>('');
  const [counter, setCounter] = useState(60);
  const inputRef: Ref = useRef(null);
  const sixtySeconds = 60;
  let timer: NodeJS.Timeout | null = null;

  const onChange = (value: string): void => {
    const array: string[] = [];
    array.push(value);
    setCode(value);
    if (array[0].toString().length == 6 && counter !== 0) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const onConfirmCode = () => {
    requestApi(confirmCode, { username: props.values?.username, code }, (response: string, error: string) => {
      if (error) {
        message.error({
          content: getCognitoErrorMsgBasedOnLanguage(error, t),
          className: getLayoutDirection(i18n.language),
        });
      }
      if (response === SUCCESS) {
        analytics.PublishEvent(new analytics.AnalyticsVerifyUserEvent());
        requestApi(loginWithCognito, props.values, (result: { user: CognitoUserExt }, error: string) => {
          if (error) {
            return;
          }
          if (result) {
            if (timer) {
              clearTimeout(timer);
            }
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
            history.push('/client-type');
          }
        });
      }
    });
  };

  const onResendConfirmation = () => {
    requestApi(resendSignupCode, values?.username, () => {
      clearInputs();
      timer && clearTimeout(timer!);
      timer = null;
      setCounter(sixtySeconds);
      timer = setTimeout(() => {
        counter > 0 && setCounter(sixtySeconds - 1);
      }, 1000);
    });
  };

  const clearInputs = () => {
    inputRef?.current?.__clearvalues__();
  };

  useEffect(() => {
    if (counter == sixtySeconds && timer) {
      timer = null;
    }
    if (counter == 0) {
      setIsCompleted(false);
    }
    timer = setTimeout(() => {
      counter > 0 && setCounter(counter - 1);
    }, 1000);
  }, [counter, timer]);

  return (
    <div className="confirmation-code-wrapper">
      <Form onFinish={onConfirmCode} className="confirm-code-container" autoComplete={'false'}>
        <Separator vertical={15} />
        <Typography.Title className="form-header">{t(CONFIRM_CODE_TITLE)}</Typography.Title>
        <Separator vertical={22} />
        <ReactCodeInput
          fields={6}
          fieldWidth={56}
          fieldHeight={48}
          className={`verification-code-numbers-container ${getLayoutDirection(i18n.language)}`}
          onChange={onChange}
          ref={(ref) => (inputRef.current = ref)}
        />
        <Separator vertical={15} />
        <div className="timer-wrapper">
          {counter > 0 ? (
            <Typography.Text> {`${counter} : 00`}</Typography.Text>
          ) : (
            <Typography.Text className="confirm-text clickable" onClick={onResendConfirmation}>
              {t(RESEND_CONFIRMATION)}
            </Typography.Text>
          )}
        </div>
        <Separator vertical={55} />
        <Button type="primary" disabled={!isCompleted} htmlType="submit" className="social-btn">
          {t(CONFIRM)}
        </Button>
      </Form>
      <Separator vertical={10} />
      {counter == 0 && (
        <div className="resend-code">
          <Typography.Text> {t(SEND_CONFIRMATION_CODE)} </Typography.Text> &nbsp;&nbsp;
          <Typography.Link className="confirm-text" onClick={onResendConfirmation}>
            {t(RESEND_CONFIRMATION)}
          </Typography.Link>
        </div>
      )}
    </div>
  );
};

export default ConfirmCodeForm;
