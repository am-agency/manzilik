import { Form, FormInstance, Input, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { Question, QuestionInput } from '../../../../../API';
import { useMainContext } from '../../../../../app/providers/main';
import { addQuestion } from '../../../api';
import { REQUIRED, TELL_US_THE_DETAILS, YOUR_QUESTION } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { required } from '../../../../projects/add_new_project';
import { checkEmptyString } from '../../../../../utils';

interface Props {
  projectId: string;
  form?: FormInstance;
  postAddQuestion: Function;
  ideaId: string;
}

export const NewQuestionForm: FunctionComponent<Props> = ({ projectId, ideaId, form, postAddQuestion }: Props) => {
  const { requestApi } = useMainContext();
  const { t } = useTranslation();

  const onFinish = (values: QuestionInput) => {
    requestApi(addQuestion, { ...values, project: projectId, idea: ideaId }, (response: Question, error: string) => {
      if (error) {
        return;
      }
      postAddQuestion(response);
      form!.resetFields();
    });
  };

  return (
    <Form className="form" onFinish={onFinish} form={form}>
      <Typography.Text>{t(YOUR_QUESTION)}</Typography.Text>
      <Form.Item
        name="title"
        rules={[
          required,
          ({ setFieldsValue }) => ({
            validator(_, value) {
              return checkEmptyString(
                value,
                (val: string) => {
                  setFieldsValue({
                    title: val,
                  });
                },
                t(REQUIRED)
              );
            },
          }),
        ]}
      >
        <Input
          onPressEnter={(e) => {
            e.preventDefault();
          }}
        />
      </Form.Item>
      <Typography.Text>{t(TELL_US_THE_DETAILS)}</Typography.Text>
      <Form.Item name="description">
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
};
