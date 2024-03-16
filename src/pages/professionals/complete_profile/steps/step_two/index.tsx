import React, { FunctionComponent, ReactElement } from 'react';
import { PaperClipOutlined } from '@ant-design/icons';
import { Col, Form, Row, Typography, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useTranslation } from 'react-i18next';
import { Professional } from '../../../../../API';
import { profileIcons } from '../../../../../assets/icons/profile';
import Separator from '../../../../../components/separator';
import {
  MAX_SIZE_FILE,
  PHOTOS,
  UPLOAD_PHOTOS,
  YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE,
} from '../../../../../locales/strings';
import { acceptableFiles, customRequest } from '../../../../../utils';
import { required } from '../../../../projects/add_new_project';
import ProfilePhotos from '../../gallery_photos';

interface Props {
  professional: Professional;
  isForceRefresh: boolean;
}

export const StepTwo: FunctionComponent<Props> = ({ professional, isForceRefresh }: Props) => {
  const { t } = useTranslation();

  const normFile = (event: { fileList: UploadFile[] }) => {
    if (Array.isArray(event)) {
      return event;
    }
    return event?.fileList;
  };

  const checkFileSize = (file: UploadFile) => {
    const isLessThan2M = file.size! / 1024 / 1024 < 2;
    return isLessThan2M;
  };

  return (
    <div>
      <Typography.Text className="photos-label">{t(PHOTOS)}</Typography.Text>
      <Separator vertical={5} />
      <div data-content={t(MAX_SIZE_FILE)} className="uploader-wrapper">
        <Form.Item
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            ...(professional?.gallery_photos?.length == 0 ? [required] : []),
            ({}) => ({
              validator(_, fileList) {
                if (fileList?.find((file: UploadFile) => !acceptableFiles.includes(file.type!))) {
                  return Promise.reject(t(YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE));
                } else if (fileList?.find((file: UploadFile) => !checkFileSize(file))) {
                  return Promise.reject(t(MAX_SIZE_FILE));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Upload
            listType="picture-card"
            accept="image/png, image/jpeg, image/gif"
            multiple
            customRequest={customRequest}
            className="professional-photos-uploader"
            itemRender={(
              originNode: ReactElement,
              file: UploadFile,
              fileList: object[],
              actions: { download: Function; preview: Function; remove: () => void }
            ) => {
              return (
                <div className="image-wrapper">
                  <div className="overlay-wrapper">
                    <img src={file.thumbUrl!} className="img-fit-content" />
                    <div className="thumbnail-overlay img-fit-content rounded-border" />
                  </div>
                  <img src={profileIcons.trashCan} className="delete-icon" onClick={actions.remove} />
                </div>
              );
            }}
          >
            <Col span={6}>
              <Row>
                <PaperClipOutlined />
                <Separator horizontal={8} />
                <div>{t(UPLOAD_PHOTOS)}</div>
              </Row>
            </Col>
          </Upload>
        </Form.Item>
      </div>

      {professional?.client?.id && (
        <ProfilePhotos paginationProps={{ resourceId: professional?.client?.id }} isForceRefresh={isForceRefresh} />
      )}
    </div>
  );
};
