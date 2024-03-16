import React from 'react';
import { Form, Checkbox, Input, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ALLOW_COMMENTS_ON_MY_PUBLIC_PHOTOS,
  ENABLE_ADD_TO_IDEABOOK_CONFIRMATION,
  PUBLIC_PROFILE_PAGE,
  WHO_CAN_MESSAGE_ME,
} from '../../../../locales/strings';
import { Option } from '../types';
import { whoCanMessageMeOptions } from '../utils';

export const AdvancedPrivacySettingFields = () => {
  const { t } = useTranslation();
  const optionsList = whoCanMessageMeOptions(t);
  return (
    <Form.List name="privacy-settings">
      {() => (
        <>
          <Typography.Text className="link-text">{t(WHO_CAN_MESSAGE_ME)}</Typography.Text>
          <Form.Item name="whoCanMessageMe" initialValue={optionsList[0].value}>
            <Select>
              {optionsList.map((option: Option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="enableAddToIdeabookConfirmation" valuePropName="checked">
            <Checkbox className="form-item-label">{t(ENABLE_ADD_TO_IDEABOOK_CONFIRMATION)}</Checkbox>
          </Form.Item>
          <Form.Item name="allowCommentsOnPublicProfile" valuePropName="checked">
            <Checkbox className="form-item-label">{t(ALLOW_COMMENTS_ON_MY_PUBLIC_PHOTOS)}</Checkbox>
          </Form.Item>
          <Typography.Text className="link-text">{t(PUBLIC_PROFILE_PAGE)}</Typography.Text>
          <Form.Item name="publicProfilePage">
            <Input />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
