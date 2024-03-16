import React from 'react';
import { Form, FormInstance, Typography } from 'antd';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../../app/providers/main';
import {
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_PHOTO,
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_VIDEO,
} from '../../../../locales/strings';
import { deleteProfessionalVideo, deleteProfessionalPhoto } from '../../api';
import { PHOTO } from '../../../../app/settings';
import { LOADING_GLOBAL } from '../../../../app/providers/main/loading_constants';

interface Props {
  id: string;
  refresh?: () => void;
  form?: FormInstance;
  type: string;
}
export const DeleteConfirmationPopup: FunctionComponent<Props> = (props: Props) => {
  const { id, refresh, form, type } = props;
  const { requestApi } = useMainContext();
  const { t } = useTranslation();

  const onFormFinish = () => {
    const endpoint = type == PHOTO ? deleteProfessionalPhoto : deleteProfessionalVideo;
    requestApi(
      endpoint,
      id,
      (response: { message: string }, error: string) => {
        if (error) {
          return;
        }
        refresh?.();
      },
      LOADING_GLOBAL
    );
  };

  return (
    <Form form={form} onFinish={onFormFinish}>
      {type == PHOTO ? (
        <Typography.Text>{t(ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_PHOTO)}</Typography.Text>
      ) : (
        <Typography.Text>{t(ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_VIDEO)}</Typography.Text>
      )}
    </Form>
  );
};
