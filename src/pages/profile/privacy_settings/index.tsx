import { Button, Checkbox, Col, Divider, Row, Select, Typography } from 'antd';
import Form from 'antd/lib/form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ADDRESS_BOOK,
  CANCEL,
  COUNTRY,
  DELETE_MY_ADDRESS_BOOK_CONTACT,
  DISCLOSE_MY_INFO_FOR_COMMERCIAL_PURPOSES,
  DOWNLOAD_A_COPY_OF_YOUR_DATA,
  MANAGE_YOUR_EMAIL_SETTINGS,
  MARKETING_AND_EMAIL_COMMUNICATIONS,
  IT_MAY_TAKE_UP_TO_3_DAYS_FOR_US_TO_FULLY_PROCESS,
  SEND_ME_SMS_FROM_MANZILIK_WITH_TIPS,
  SMS_OFFERS,
  UNDER_CALIFORNIA_LAW_LEARN_MORE_HERE,
  UPDATE,
  YOUR_PRIVACY_SETTINGS,
} from '../../../locales/strings';

export const PrivacySettings = () => {
  const { t } = useTranslation();
  return (
    <Row className="privacy-settings-form">
      <Form>
        <Col>
          <Typography.Title className="title">{t(YOUR_PRIVACY_SETTINGS)}</Typography.Title>
          <span>{t(COUNTRY)}</span>
          <Form.Item name="country">
            <Select>
              <Select.Option value={1}>OPTIONS1</Select.Option>
              <Select.Option value={2}>OPTIONS2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="smsOffers" valuePropName="checked">
            <Checkbox className="form-item-label">{t(SMS_OFFERS)}</Checkbox>
          </Form.Item>
          <p>
            {t(SEND_ME_SMS_FROM_MANZILIK_WITH_TIPS)}
            {t(IT_MAY_TAKE_UP_TO_3_DAYS_FOR_US_TO_FULLY_PROCESS)}
          </p>
          <Form.Item name={'discloseInfo'} className="form-item-label" valuePropName="checked">
            <Checkbox>{t(DISCLOSE_MY_INFO_FOR_COMMERCIAL_PURPOSES)}</Checkbox>
          </Form.Item>
          <p>{t(UNDER_CALIFORNIA_LAW_LEARN_MORE_HERE)}</p>
          <Divider />
          <Typography.Text>{t(MARKETING_AND_EMAIL_COMMUNICATIONS)}</Typography.Text>
          <br></br>
          <Typography.Text underline className="link-text">
            {t(MANAGE_YOUR_EMAIL_SETTINGS)}
          </Typography.Text>
          <br></br>
          <br></br>
          <Typography.Text>{t(ADDRESS_BOOK)}</Typography.Text>
          <br></br>
          <Typography.Text underline className="link-text">
            {t(DELETE_MY_ADDRESS_BOOK_CONTACT)}
          </Typography.Text>
          <Divider />
          <Typography.Text underline className="link-text">
            {t(DOWNLOAD_A_COPY_OF_YOUR_DATA)}
          </Typography.Text>
          <Row justify="end">
            <Button type="ghost">{t(CANCEL)}</Button>
            <Button type="primary">{t(UPDATE)}</Button>
          </Row>
        </Col>
      </Form>
    </Row>
  );
};
