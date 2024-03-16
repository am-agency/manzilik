import React, { FunctionComponent, useEffect } from 'react';
import { Form, FormInstance, Input, Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import { required } from '../../../projects/add_new_project';
import { Review } from '../../../../API';
import { DO_YOU_WANT_TO_SHARE_MORE, HOW_DO_YOU_RATE_THIS_STORE } from '../../../../locales/strings';

interface Props {
  form?: FormInstance;
  onFinish: Function;
  review?: Review;
}

const ReviewStore: FunctionComponent<Props> = ({ onFinish, form, review }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    form?.setFieldsValue(review);
  }, [review]);

  return (
    <Form
      className="form"
      form={form}
      onFinish={(values) => {
        onFinish(values);
      }}
    >
      <div>{t(HOW_DO_YOU_RATE_THIS_STORE)}</div>
      <Form.Item name="rating" rules={[required]} initialValue={review?.rating}>
        <Rate allowHalf />
      </Form.Item>
      <div>{t(DO_YOU_WANT_TO_SHARE_MORE)}</div>
      <Form.Item name="content" rules={[required]} initialValue={review?.content}>
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
};

export default ReviewStore;
