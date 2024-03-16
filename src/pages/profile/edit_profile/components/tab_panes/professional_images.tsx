import React, { useState } from 'react';
import { Button, message, Upload, UploadProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { ADD_PHOTO, MAX_SIZE_FILE, PROFILE_IDEAS, SOMETHING_WENT_WRONG } from '../../../../../locales/strings';
import { PlusOutlined } from '@ant-design/icons';
import Separator from '../../../../../components/separator';
import { UploadFile } from 'antd/lib/upload/interface';
import { useMainContext } from '../../../../../app/providers/main';
import { uploadAsset } from '../../../../../utils/assets_manager';
import { v4 as uuid } from 'uuid';
import { MakhzanDestination } from '../../../../project/upload_idea';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../../../app/providers/main/loading_constants';
import { uploadProfessionalPhotos } from '../../../../professionals/api';
import { Client, Professional } from '../../../../../API';
import { customRequest } from '../../../../../utils';
import ProfilePhotos from '../../../../professionals/complete_profile/gallery_photos';
import { PrivateProfileHeader } from '../profile_header';

interface Props {
  client: Client;
}

export const ProfessionalImages = ({ client }: Props) => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [isForceRefresh, setIsForceRefresh] = useState<boolean>(false);

  const onUploadPhotos = async (fileList: UploadFile[]) => {
    try {
      const photosList = fileList?.map((file) => {
        if (file.originFileObj) {
          return requestApi(
            uploadAsset,
            {
              file: file.originFileObj,
              file_name: uuid(),
              content_type: file.type,
              destination: MakhzanDestination.GENERAL,
            },
            async (url: string, error: string) => {
              if (error) {
                return;
              }
              return url;
            },
            LOADING_LOW_PRIORITY_GLOBAL
          );
        } else {
          return file.url;
        }
      });
      return await Promise.all(photosList || []);
    } catch (error) {
      console.error(error);
    }
  };

  const checkFileSize = (file: UploadFile) => {
    const isLessThan2M = file.size! / 1024 / 1024 < 2;
    return isLessThan2M;
  };

  const onUploadProfessionalPhotos = async (files: UploadFile[]) => {
    const photos = await onUploadPhotos(files);
    requestApi(
      uploadProfessionalPhotos,
      { photos },
      (result: Professional, error: string) => {
        if (error) {
          return;
        }
        setIsForceRefresh(true);
      },
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const props: UploadProps = {
    name: 'file',
    customRequest: customRequest,
    onChange(info) {
      const {
        file,
        file: { status },
        fileList,
      } = info;
      if (status !== 'uploading' && !checkFileSize(file)) {
        message.error(t(MAX_SIZE_FILE));
        return;
      }
      if (status === 'done') {
        onUploadProfessionalPhotos(fileList);
        return;
      } else if (status === 'error') {
        message.error(t(SOMETHING_WENT_WRONG));
        return;
      }
    },
    showUploadList: false,
  };

  return (
    <>
      <PrivateProfileHeader
        title={t(PROFILE_IDEAS)}
        toolbar={
          <Upload {...props}>
            <Button
              icon={<PlusOutlined className="edit-profile__action-button__icon" />}
              className="edit-profile__action-button"
            >
              {t(ADD_PHOTO)}
            </Button>
          </Upload>
        }
      />
      <Separator vertical={10} />
      <div className="photos-vidoes-container">
        {client && (
          <>
            <ProfilePhotos paginationProps={{ resourceId: client?.id }} isForceRefresh={isForceRefresh} />
          </>
        )}
      </div>
    </>
  );
};
