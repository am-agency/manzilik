import React, { FunctionComponent } from 'react';
// hooks
import { useMainContext } from '../../../../app/providers/main';
import { useTranslation } from 'react-i18next';
// api
import { deleteEntity } from '../../api';
// strings
import { ARE_YOU_SURE_DELETE_IDEA, DELETE } from '../../../../locales/strings';
// component
import { Form, FormInstance, Typography } from 'antd';
import { DONE } from '../../../projects/constants';
import { BaseEntity } from '../../../../components/idea/types';

interface Props {
  projectId: string;
  projectIdeaList?: BaseEntity[];
  form?: FormInstance;
  postIdeaOperation?: Function;
  clearIdeasSelection?: Function;
}

export const DeleteIdeaForm: FunctionComponent<Props> = (props: Props) => {
  const { postIdeaOperation, projectIdeaList, form, projectId, clearIdeasSelection } = props;
  const { requestApi } = useMainContext();
  const { t } = useTranslation();

  const onFormFinish = () => {
    const ids = projectIdeaList?.map((elm) => {
      return elm.entity_id;
    });

    requestApi(
      deleteEntity,
      {
        project_id: projectId,
        ids: ids,
      },
      (response: { message: string }, error: string) => {
        if (error) {
          return;
        }
        clearIdeasSelection?.();
        if (response?.message === DONE) {
          postIdeaOperation?.(projectIdeaList, DELETE);
        }
      }
    );
  };

  return (
    <Form form={form} onFinish={onFormFinish}>
      <Typography.Text>{t(ARE_YOU_SURE_DELETE_IDEA)}</Typography.Text>
    </Form>
  );
};
