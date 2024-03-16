import React from 'react';
import { Form, Input, FormInstance, Typography } from 'antd';
import { FunctionComponent } from 'react';
import { ENTER_NEW_QUANTITY, QUANTITY_VALIDATION_MESSAGE } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface Props {
  onFinish: Function;
  form: FormInstance;
  itemsLeft: number;
}
export const QuantityForm: FunctionComponent<Props> = ({ onFinish, form, itemsLeft }: Props) => {
  const { t } = useTranslation();

  return (
    <Form onFinish={(values) => onFinish(values)} form={form} className="form">
      <Typography.Text>{t(ENTER_NEW_QUANTITY)} </Typography.Text>
      <Form.Item
        name="itemNumber"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, inputValue) {
              if (parseInt(inputValue) > 0 && parseInt(inputValue) <= itemsLeft) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(`${t(QUANTITY_VALIDATION_MESSAGE)} ${itemsLeft}`));
            },
          }),
        ]}
      >
        <Input type="number" />
      </Form.Item>
    </Form>
  );
};
