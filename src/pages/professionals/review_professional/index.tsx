import React, { FunctionComponent, useEffect } from 'react';
import { Form, FormInstance, Input, Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import { Review } from '../../../API';
import {
  HOW_DO_YOU_RATE_THIS_PROFESSIONAL,
  DO_YOU_WANT_TO_SHARE_MORE,
  HOW_DO_YOU_RATE_THIS_PARTNER,
} from '../../../locales/strings';
import { required } from '../../projects/add_new_project';

interface Props {
  form?: FormInstance;
  onFinish: Function;
  review?: Review;
  userId: string;
  isPartner: boolean;
}

const ReviewProfessional: FunctionComponent<Props> = ({ onFinish, form, review, userId, isPartner }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    form?.setFieldsValue(review);
  }, [review]);

  useEffect(() => {
    form?.resetFields();
  }, [userId]);

  return (
    <Form
      className="form"
      form={form}
      onFinish={(values) => {
        onFinish(values);
      }}
    >
      <div>{isPartner ? t(HOW_DO_YOU_RATE_THIS_PARTNER) : t(HOW_DO_YOU_RATE_THIS_PROFESSIONAL)}</div>
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

export default ReviewProfessional;
