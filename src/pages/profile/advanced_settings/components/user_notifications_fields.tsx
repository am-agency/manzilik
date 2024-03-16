import React from 'react';
import Form from 'antd/lib/form';
import { Checkbox, Col, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_CENTER, SHOW_ACTIVITIES_FROM_USERS_I_AM_FOLLOWING } from '../../../../locales/strings';
import { getUserActivityNotificationsSelectFields } from '../utils';
import { Option } from '../types';

export const UserActivityNotifications = () => {
  const { t } = useTranslation();

  return (
    <Form.List name="userActivityNotifications">
      {() => (
        <>
          {getUserActivityNotificationsSelectFields(t).map(
            (elem: { label: string; name: string; options: Option[] }) => (
              <Row align="middle" justify="space-between" key={elem.name}>
                <Col xl={12} lg={12} md={8} sm={24} xs={24}>
                  <Typography.Text className="link-text">{elem.label}</Typography.Text>
                </Col>
                <Col xl={12} lg={12} md={15} sm={24} xs={24}>
                  <Form.Item key={elem.name} name={elem.name} initialValue={elem.options[0].value}>
                    <Select>
                      {elem.options.map((option: Option) => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.value}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )
          )}
          <Typography.Text>{t(NOTIFICATION_CENTER)}</Typography.Text>
          <Form.Item name="showActivitiesForFollowing" valuePropName="checked">
            <Checkbox className="form-item-label">{t(SHOW_ACTIVITIES_FROM_USERS_I_AM_FOLLOWING)}</Checkbox>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
