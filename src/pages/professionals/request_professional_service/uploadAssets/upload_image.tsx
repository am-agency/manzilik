import React, { useEffect, useRef } from 'react';
import { PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import { Col, Row, Typography, Upload } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { useState } from 'react';
import Separator from '../../../../components/separator';
import { IMAGES, SELECT_IMAGES_TO_UPLOAD, UPLOAD_PHOTO } from '../../../../locales/strings';
import { customRequest } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../../app/providers/main';
import { uploadAsset } from '../../../../utils/assets_manager';
import { MakhzanDestination } from '../../../project/upload_idea';

interface Props {
  onChange: (assets: string[]) => void;
  defaultImages?: string[];
  maxCount?: number;
  clearPhotos?: boolean;
  isAcceptingFiles?: boolean;
  uploadText?: string;
  mainText?: string;
}

export const UploadImage = ({
  onChange,
  defaultImages,
  maxCount = 10,
  clearPhotos,
  isAcceptingFiles = false,
  uploadText = SELECT_IMAGES_TO_UPLOAD,
  mainText = UPLOAD_PHOTO,
}: Props) => {
  const assets = useRef(new Set<string>());
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const inputAccept = isAcceptingFiles ? 'file' : 'image/*';

  useEffect(() => {
    if (defaultImages?.length! > 0) {
      setFileList(
        defaultImages!.map((image) => {
          return {
            uid: image,
            name: image,
            status: 'done',
            url: image,
          };
        })
      );
    } else {
      setFileList([]);
    }
  }, [defaultImages?.length!]);
  const handleClearPhotos = () => {
    setFileList([]);
    assets.current.clear();
    onChange([]);
  };

  useEffect(() => {
    if (clearPhotos) {
      handleClearPhotos();
    }
  }, [clearPhotos]);

  const handleChange: UploadProps['onChange'] = ({ file }) => {
    const fileUploading: UploadFile = { ...file, percent: 0, status: 'uploading' };
    const found = fileList.find((_file) => _file.uid === fileUploading.uid);

    if (!found) {
      setFileList((pre) => {
        return [...pre, fileUploading];
      });
    }

    if (file && !found) {
      onUpload(file.originFileObj as RcFile, (progress) => {
        const percent = parseFloat((progress * 100).toFixed(1));
        setFileList((files) => {
          return files.map((_file) => {
            const match = file.uid !== _file.uid;
            if (match) {
              return _file;
            } else {
              const status = percent === 100 ? 'success' : 'uploading';
              return { ...file, percent, status };
            }
          });
        });
      });
    }
  };

  const uploadServiceRequestAssets = (file: RcFile, onProgress: (progress: number) => void) => {
    return new Promise<string>((resolve, reject) => {
      requestApi(
        uploadAsset,
        {
          file,
          file_name: file.uid,
          content_type: file.type,
          destination: MakhzanDestination.GENERAL,
          onProgress,
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

  const onUpload = async (file: RcFile, onProgress: (progress: number) => void) => {
    const url = await uploadServiceRequestAssets(file, onProgress);
    assets.current.add(url);
    const arrayOfAssetsWithMaxCount = Array.from(assets.current).slice(0, maxCount);
    onChange(arrayOfAssetsWithMaxCount);
  };

  return (
    <Upload
      listType="picture-card"
      accept={inputAccept}
      customRequest={customRequest}
      onChange={handleChange}
      fileList={fileList.length > maxCount! ? fileList.slice(0, maxCount) : fileList}
      maxCount={3}
      multiple
      onRemove={(file) => {
        if (file.status === 'done') {
          setFileList((pre) => {
            return pre.filter((_file) => _file.uid !== file.uid);
          });
          onChange(
            Array.from(assets.current).filter((asset) => {
              return !asset.includes(file.uid);
            })
          );
        }

        const allAssets = assets.current;
        allAssets.forEach((asset) => {
          if (asset.includes(file.uid)) {
            setFileList((pre) => {
              return pre.filter((_file) => _file.uid !== file.uid);
            });
            onChange(
              Array.from(assets.current).filter((asset) => {
                return !asset.includes(file.uid);
              })
            );
          }
        });
      }}
    >
      <section className="upload-contents">
        <Col>
          <UploadOutlined />
        </Col>
        <Col>
          <Typography.Text strong className="upload-title">
            {t(mainText)}
          </Typography.Text>
          <Typography.Paragraph className="upload-subtitle">{t(uploadText)}</Typography.Paragraph>
        </Col>
      </section>
    </Upload>
  );
};
