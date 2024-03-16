import React from 'react';
import { Form, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import { getEmailSubscriptionsCheckboxFields } from '../utils';

export const EmailSubscriptionsCheckboxFields = () => {
  const { t } = useTranslation();
  return (
    <Form.List name="emailSubscriptions">
      {() => (
        <>
          {getEmailSubscriptionsCheckboxFields(t).map((elem) => (
            <Form.Item key={elem.name} name={elem.name} valuePropName="checked">
              <Checkbox className="form-item-label">{elem.label}</Checkbox>
            </Form.Item>
          ))}
        </>
      )}
    </Form.List>
  );
};
