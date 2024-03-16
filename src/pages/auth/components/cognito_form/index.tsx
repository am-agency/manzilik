import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Radio, FormInstance, Checkbox } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  AGREE_TO_TERMS,
  EMAIL as EMAIL_TEXT,
  HOMEOWNER,
  PASSWORD,
  PASSWORD_REQUIRED_MESSAGE,
  PROFESSIONAL,
  REGEX_DOESNT_MATCH_MSG,
  SIGNUP_WITH_EMAIL,
  TYPE,
  MOBILE as MOBILE_TEXT,
  TERMS_AND_CONDITIONS,
  LOGIN,
  FORGET_PASSWORD,
  MAIL,
  REQUIRED,
  PLEASE_WRITE_VALID_EMAILS,
  PLEASE_ENTER_VALID_PHONE_NUMBER_EX,
  ENABLE_ADD_TO_IDEABOOK_CONFIRMATION,
  SUBSCRIBE_TO_NEWSLETTER,
  MUST_AGREE_TERMS,
  FIRST_NAME,
  LAST_NAME,
} from '../../../../locales/strings';
import { getLayoutDirection } from '../../../../app/layouts';
import { useTranslation } from 'react-i18next';
import { CustomSwitch } from '../../../../components/custom_switch';
import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX_WITH_PLUS } from '../../signup/constants';
import { required } from '../../../projects/add_new_project';
import { UserRole } from '../../../../app/types';
import Separator from '../../../../components/separator';
import { MOBILE, EMAIL, FIRST_LAST_NAME_FLAG } from '../../../../app/settings';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { TERMS_AND_CONDITIONS_ROUTE } from '../../../../utils/routes';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import icons from '../../../../assets/icons';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import { useFeature } from 'flagged';

interface Props {
  onFinish: Function;
  form?: FormInstance;
  isSignupForm: boolean;
}

const { REACT_APP_RECAPTCHA_SITE_KEY } = process.env;

export const CognitoForm = ({ onFinish, form, isSignupForm }: Props) => {
  const { t, i18n } = useTranslation();
  const [type, setType] = useState<string>(EMAIL);
  const [isPassword, showPassword] = useState<boolean>(false);
  const { setCurrentScreenName } = useContext(SharedStateContext) as SharedStateInterface;
  const isTypeDisabled = true;
  const { search } = useLocation();
  const referralCode = new URLSearchParams(search).get('referral_code');
  localStorage.setItem('referee_referral_code', referralCode || '');

  const onPasswordIconClick = () => {
    showPassword(!isPassword);
  };

  const onChange = (checked: boolean) => {
    const status = checked ? EMAIL : MOBILE;
    setType(status);
    form?.setFieldsValue({
      username: null,
      password: null,
    });
  };
  const isFirstLastNameFlagOn = useFeature(FIRST_LAST_NAME_FLAG);

  return (
    <Form
      autoComplete="false"
      name="basic"
      onFinish={(values) => {
        const newValues = { ...values, username: values.username.toLowerCase(), referral_code: referralCode };
        onFinish(newValues, type);
      }}
      form={form}
    >
      {isSignupForm && isFirstLastNameFlagOn && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Form.Item
            name="first_name"
            className="group-floating-label"
            rules={[{ required: true, message: t(REQUIRED) }]}
            style={{ width: '50%', margin: '10px 0px' }}
          >
            <Input
              className="signup-input form-input switch-input-wrapper"
              type="text"
              placeholder="."
              suffix={
                <>
                  <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="first_name">
                    {t(FIRST_NAME)}*
                  </label>
                </>
              }
            />
          </Form.Item>

          <Form.Item
            name="last_name"
            className="group-floating-label"
            rules={[{ required: true, message: t(REQUIRED) }]}
            style={{ width: '50%', margin: '10px 0px' }}
          >
            <Input
              className="signup-input form-input switch-input-wrapper"
              type="text"
              placeholder="."
              suffix={
                <>
                  <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="first_name">
                    {t(LAST_NAME)}*
                  </label>
                </>
              }
            />
          </Form.Item>
        </div>
      )}
      <Form.Item
        name="username"
        className="group-floating-label"
        rules={[
          { required: true, message: t(REQUIRED) },
          {
            pattern: type === EMAIL ? EMAIL_REGEX : PHONE_REGEX_WITH_PLUS,
            message: type === EMAIL ? t(PLEASE_WRITE_VALID_EMAILS) : t(PLEASE_ENTER_VALID_PHONE_NUMBER_EX),
          },
        ]}
      >
        <Input
          className="signup-input form-input switch-input-wrapper"
          type={type == EMAIL ? 'email' : 'text'}
          inputMode="email"
          placeholder="."
          suffix={
            <>
              <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="email">
                {type == EMAIL ? t(EMAIL_TEXT) : t(MOBILE_TEXT)}
              </label>
              <CustomSwitch
                type={type}
                onChange={onChange}
                defaultValue={EMAIL}
                firstLabel={t(MOBILE_TEXT)}
                secondLabel={t(MAIL)}
              />
            </>
          }
        />
      </Form.Item>
      <Form.Item
        name="password"
        className="group-floating-label"
        rules={[
          {
            required: true,
            message: t(PASSWORD_REQUIRED_MESSAGE),
          },
          {
            pattern: PASSWORD_REGEX,
            message: t(REGEX_DOESNT_MATCH_MSG),
          },
        ]}
      >
        <Input
          className="signup-input form-input"
          type={isPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="."
          suffix={
            <>
              <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="password">
                {t(PASSWORD)}
              </label>
              <EyeInvisibleOutlined onClick={onPasswordIconClick} />
            </>
          }
        />
      </Form.Item>
      {isSignupForm && !isTypeDisabled && (
        <Form.Item
          initialValue={UserRole.HomeOwner}
          name="role"
          label={t(TYPE)}
          rules={[required]}
          className="user-role"
        >
          <Radio.Group buttonStyle="solid" className="user-type-radio-group">
            <Radio.Button value={UserRole.HomeOwner}>
              <div className="img-div">
                <img className="home_owner" src={icons.home_owner.auth_icon} alt="home_owner" />
              </div>
              <Separator horizontal={4} />
              {t(HOMEOWNER)}
            </Radio.Button>
            <Radio.Button value={UserRole.Professional}>
              <div className="img-div">
                <img className="professional" src={icons.professional.auth_icon} alt="professional" />
              </div>
              <Separator horizontal={4} />
              {t(PROFESSIONAL)}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}
      <Separator vertical={5} />
      {isSignupForm ? (
        <>
          <Form.Item
            rules={[{ required: true, message: t(MUST_AGREE_TERMS) }]}
            name="enableAddToIdeabookConfirmation"
            valuePropName="checked"
          >
            <Checkbox className="form-item-label">
              <span className="terms-wrapper">
                <Typography.Text className="terms-conditions-text">{t(AGREE_TO_TERMS)}</Typography.Text>
                &nbsp;&nbsp;
                <Typography.Text className="link">
                  <Link to={TERMS_AND_CONDITIONS_ROUTE}>{t(TERMS_AND_CONDITIONS)}</Link>
                </Typography.Text>
              </span>
            </Checkbox>
          </Form.Item>
          {type == EMAIL && (
            <Form.Item name="subscribe" valuePropName="checked" initialValue={true}>
              <Checkbox className="form-item-label">
                <span className="subscribe-wrapper">
                  <Typography.Text className="subscribe-text">{t(SUBSCRIBE_TO_NEWSLETTER)}</Typography.Text>
                </span>
              </Checkbox>
            </Form.Item>
          )}
          <Form.Item name="recaptcha" className="recaptcha">
            <ReCAPTCHA sitekey={REACT_APP_RECAPTCHA_SITE_KEY!} />
          </Form.Item>
        </>
      ) : (
        <span className="terms-wrapper">
          <Typography.Text className="link">
            <Link to={'/forget-password'}>{t(FORGET_PASSWORD)}</Link>
          </Typography.Text>
        </span>
      )}
      <Separator vertical={8} />
      <Button type="primary" htmlType="submit" className="signup-btn">
        {isSignupForm ? t(SIGNUP_WITH_EMAIL) : t(LOGIN)}
      </Button>
    </Form>
  );
};
