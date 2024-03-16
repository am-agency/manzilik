import React, { useState } from 'react';
import { Button, Form, FormInstance, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { convertUrlToFile, isValidURL } from '../utils';
import { ADD_PHOTO, ADD_WEB_PAGE_URL, FIELD_SHOULD_BE_URL } from '../../../locales/strings';
import { ModalFooter } from './modal_footer';
import { useModal } from '../../../app/providers/modal';
import { ModalTitle } from '../../../components/modal_title';
import photoIcon from '../../../assets/icons/photo.svg';
import { PhotosModal } from './photos_modal';
import { useMainContext } from '../../../app/providers/main';
import { fetchImagesFromUrl } from '../api';
import { useForm } from 'antd/lib/form/Form';
import { LOADING_GLOBAL } from '../../../app/providers/main/loading_constants';

interface Props {
  form?: FormInstance;
  onUploadIdea: Function;
  setActiveKey: Function;
}
export const IdeasFromWeb = ({ onUploadIdea, setActiveKey }: Props) => {
  const { t } = useTranslation();
  const { showModal, setModalVisible } = useModal();
  const { requestApi } = useMainContext();
  const [form] = useForm();

  const onSavePhoto = async (url: string) => {
    const type = `image/jpeg`;
    convertUrlToFile(url, (file: File, error: string) => {
      if (error) {
        return;
      }
      if (file) {
        onUploadIdea([{ originFileObj: file, type }]);
      }
    });
  };

  const onFinish = (values: { url: string }) => {
    requestApi(
      fetchImagesFromUrl,
      values.url,
      (result: string[], error: string) => {
        if (error) {
          return;
        }
        setModalVisible?.(false);
        if (result) {
          showModal(
            <ModalTitle icon={photoIcon} title={t(ADD_PHOTO)} />,
            <PhotosModal photos={result} onSavePhoto={onSavePhoto} />,
            `photos-modal-wrapper modal-wrapper modal-with-custom-footer ${result.length == 0 && 'no-data-modal'}`,
            '',
            <div />
          );
        }
      },
      LOADING_GLOBAL
    );
  };

  return (
    <Form className="form ideas-from-web" form={form} onFinish={onFinish}>
      <Typography.Text> {t(ADD_WEB_PAGE_URL)} </Typography.Text>
      <Form.Item
        shouldUpdate
        name="url"
        dependencies={['url']}
        rules={[
          () => ({
            validator(_, inputValue) {
              if (isValidURL(inputValue)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t(FIELD_SHOULD_BE_URL)));
            },
          }),
        ]}
      >
        <Input placeholder="http://" className="url-input" />
      </Form.Item>
      <ModalFooter setActiveKey={setActiveKey} form={form} />
    </Form>
  );
};
