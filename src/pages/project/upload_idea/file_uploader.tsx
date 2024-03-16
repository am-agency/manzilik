import React, { ReactNode, useState } from 'react';
import { Upload, FormInstance, Form, Modal, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { DROP_FILE_HERE, UPLOAD, UPLOAD_TERMS, YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { PictureFilled, PlusOutlined } from '@ant-design/icons';
import { customRequest, acceptableFiles, getBase64 } from '../../../utils';
import { ModalFooter } from '../components/modal_footer';
import { PICKER_TYPE } from '../../../app/settings';

interface Props {
  onFinish?: Function;
  form?: FormInstance;
  type?: string;
  customUploadButton?: ReactNode;
  fileLength?: number;
}

export interface ImageInfo {
  file?: UploadFile;
  fileList?: UploadFile[];
}
const DefaultUploadButton = () => {
  const { t } = useTranslation();
  return (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t(UPLOAD)}</div>
    </div>
  );
};

export const FileUploader = ({ onFinish, form, type, customUploadButton, fileLength }: Props) => {
  const { t } = useTranslation();

  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [multiUploaderFileList, setMultiUploaderFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewVisible(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview!);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const props = {
    multiple: true,
    customRequest: customRequest,
    accept: 'image/png, image/jpeg',
  };

  const normFile = (event: { fileList: UploadFile[] }) => {
    if (Array.isArray(event)) {
      return event;
    }
    return event && event?.fileList;
  };

  const onPostUpload = () => {
    setMultiUploaderFileList([]);
  };

  const noFilesSelected =
    !form?.getFieldValue('fileList') ||
    form?.getFieldValue('fileList')?.length == 0 ||
    multiUploaderFileList.length == 0;

  const renderUploaderWithButton = () => (
    <Upload
      customRequest={customRequest}
      listType="picture-card"
      onPreview={handlePreview}
      accept="image/png, image/jpeg"
    >
      {multiUploaderFileList?.length >= fileLength! ? null : customUploadButton || <DefaultUploadButton />}
    </Upload>
  );

  const renderUploaderComponent = () => {
    if (type === PICKER_TYPE || !noFilesSelected) {
      return renderUploaderWithButton();
    }
    return (
      <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <PictureFilled />
        </p>
        <p className="drop-files">{t(DROP_FILE_HERE)}</p>
        <p className="upload-terms">{t(UPLOAD_TERMS)}</p>
      </Upload.Dragger>
    );
  };

  return (
    <Form
      form={form}
      onFinish={(values) => {
        if (values.fileList.length > 0) {
          onFinish?.(values.fileList)!;
          onPostUpload();
          form?.resetFields();
        }
      }}
    >
      <Form.Item
        shouldUpdate
        name="fileList"
        dependencies={['fileList']}
        valuePropName="fileList"
        validateTrigger="onChange"
        getValueFromEvent={normFile}
        rules={[
          ({ getFieldValue, setFieldsValue }) => ({
            validator(_, fileList) {
              if (fileList?.find((file: UploadFile) => !acceptableFiles.includes(file.type!))) {
                const filteredFileList = fileList.filter((file: UploadFile) => acceptableFiles.includes(file.type!));
                setFieldsValue({
                  fileList: filteredFileList,
                });
                setMultiUploaderFileList(filteredFileList);
                message.error(t(YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE));
                return Promise.reject(new Error(t(YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE)));
              } else {
                fileList.map((file: UploadFile) => (file.status = 'done'));
                setMultiUploaderFileList(fileList);
                return Promise.resolve();
              }
            },
          }),
        ]}
      >
        {renderUploaderComponent()}
      </Form.Item>
      <ModalFooter form={form} />
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        className="image-preview-modal"
      >
        <img src={previewImage} />
      </Modal>
    </Form>
  );
};
