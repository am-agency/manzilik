import { Upload } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { aiIcons } from '../../../../assets/icons/ai';
import { START_UPLOAD_PHOTO } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { customRequest } from '../../../../utils';
import { useMainContext } from '../../../../app/providers/main';
import { uploadAsset } from '../../../../utils/assets_manager';
import { MakhzanDestination } from '../../../project/upload_idea';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';
import { v4 as uuid } from 'uuid';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface FormUploaderProps {
  formUploadRef: React.RefObject<{
    upload: {
      uploader: {
        onClick: () => void;
      };
    };
  }>;
}

function FormUploader(props: FormUploaderProps) {
  const { formUploadRef } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { t } = useTranslation();
  const { requestApi, userState } = useMainContext();
  const { isAuthenticated } = userState;
  const { formData, setFormData, setOriginalImageURL, loginRedirection } = useContext(
    ManzilikAiContext
  ) as ManzilikAiProps;

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  useEffect(() => {
    const uploadButton = document.querySelector('.ant-upload.ant-upload-select-picture-card');
    if (fileList.length === 1) {
      if (uploadButton) {
        uploadButton.classList.add('hidden');
      }
    } else {
      if (uploadButton) {
        uploadButton.classList.remove('hidden');
      }
    }
  }, [fileList.length]);
  const uploadPhoto = async (file: UploadFile) => {
    return new Promise<string>((resolve, reject) => {
      requestApi(
        uploadAsset,
        {
          file,
          file_name: uuid().replace(/-/g, ''),
          content_type: file.type,
          destination: MakhzanDestination.MANZILIKAI,
        },
        async (url: string, error: string) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(url);
        }
      );
    });
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const file = newFileList[0]?.originFileObj as RcFile;
    if (file) {
      uploadPhoto(file)
        .then((url) => {
          setOriginalImageURL!(url);
          setFormData!({ ...formData!, imageURL: url });
        })
        .catch((error) => {
          return;
        });
      setFileList(newFileList);
    } else {
      setFormData!({ ...formData!, imageURL: '' });
    }
  };
  return (
    <div className="file-uploader" onClick={() => loginRedirection!()}>
      <Upload
        listType="picture-card"
        accept="image/png, image/jpeg, image/gif"
        fileList={fileList}
        customRequest={customRequest}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={() => {
          setFileList([]);
        }}
        maxCount={1}
        showUploadList={{ showPreviewIcon: false }}
        ref={formUploadRef}
        iconRender={() => <img src={aiIcons.addImage} />}
        disabled={!isAuthenticated}
      >
        <div className="upload-btn ">
          <img src={aiIcons.addImage} />
          <p>{t(START_UPLOAD_PHOTO)}</p>
        </div>
      </Upload>
    </div>
  );
}

export default FormUploader;
