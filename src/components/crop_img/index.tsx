import React, { useState, useRef, useEffect, useContext } from 'react';
// Components
import { Col, Form, FormInstance, message, Row, Typography, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
// Hooks
import { useMainContext } from '../../app/providers/main';
import { useTranslation } from 'react-i18next';
// Icons
import icons from '../../assets/icons';
import { profileIcons } from '../../assets/icons/profile';
// Utils
import { getBase64, acceptableFiles, customRequest } from '../../utils';
// Strings
import {
  CLICK_OR_DRAG_DROP_FILES_HERE_TO_UPLOAD,
  DRAG_THE_CORNER_OF_THE_BOX_TO_CHANGE_POSITION_AND_SIZE_OR_UPLOAD_A_NEW_IMAGE,
  YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE,
} from '../../locales/strings';
import { MakhzanDestination } from '../../pages/project/upload_idea';
import { uploadAsset } from '../../utils/assets_manager';

import { v4 as uuid } from 'uuid';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

interface Props {
  form?: FormInstance;
  onUpdateClientInformation?: Function;
  showModal?: boolean;
}

export const CropImage = (props: Props) => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;

  const [imgSrc, setImageSrc] = useState<string | null>(client?.profile_image!);
  const { requestApi, userState } = useMainContext();
  const previewCanvasRef: { current: HTMLCanvasElement | null } = useRef(null);
  const [file, setFile] = useState<UploadFile>();
  const { t } = useTranslation();
  const [degree, rotate] = useState(0);

  const handleChange = async (info: UploadChangeParam) => {
    rotate(0);
    if (!acceptableFiles.includes(info.file.type!)) {
      message.destroy();
      message.error(t(YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE));
      return;
    }
    const imageUrl = await getBase64(info.file.originFileObj);
    const canvas: HTMLCanvasElement = previewCanvasRef.current!;
    const ctx = canvas?.getContext('2d');
    const img: HTMLImageElement = new Image();
    if (canvas) {
      img.addEventListener('load', () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.imageSmoothingQuality = 'high';
        ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx?.drawImage(img, 0, 0);
      });
      img.src = imageUrl!;
    }
    setFile(info.file);
    setImageSrc(imageUrl);
  };

  const onFormFinish = () => {
    if (!previewCanvasRef.current) {
      return;
    }

    previewCanvasRef!.current!.toBlob(
      async (blob: Blob | null) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileToUpload: any = file!;
        if (fileToUpload) {
          fileToUpload.originFileObj = {
            ...blob!,
            lastModified: new Date().getTime(),
            lastModifiedDate: new Date(),
            uid: userState.user?.sub!,
            name: file?.name!,
          };
        }
        if (imgSrc) {
          requestApi(
            uploadAsset,
            {
              file: blob,
              file_name: uuid(),
              content_type: fileToUpload.type,
              destination: MakhzanDestination.PROFILE,
            },
            async (url: string, error: string) => {
              if (!error) {
                props.onUpdateClientInformation?.({ url, base64: await getBase64(blob) });
                setImageSrc(null);
              }
            }
          );
        } else {
          props.onUpdateClientInformation?.({ url: null, base64: null });
        }
      },
      file?.type,
      1
    );
  };

  const onRotateLeft = () => {
    rotate(degree - 90);
  };

  const onRotateRight = () => {
    rotate(degree + 90);
  };

  useEffect(() => {
    if (!degree || !previewCanvasRef.current) {
      return;
    }

    const img: HTMLImageElement = new Image();
    const canvas: HTMLCanvasElement = previewCanvasRef.current!;
    img.addEventListener('load', () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas!.getContext('2d');
      const radians = (degree / 180) * Math.PI;
      ctx!.imageSmoothingQuality = 'high';
      ctx?.translate(canvas.width / 2, canvas.height / 2);
      ctx?.rotate(radians);
      ctx?.drawImage(img, -canvas!.width! / 2, -canvas!.height! / 2);
      ctx?.restore();
    });
    img.src = imgSrc!;
  }, [degree]);

  useEffect(() => {
    rotate(0);
    setImageSrc(client?.profile_image!);
  }, [props.showModal]);

  return (
    <Form form={props.form} onFinish={onFormFinish}>
      <Typography.Text>
        {t(DRAG_THE_CORNER_OF_THE_BOX_TO_CHANGE_POSITION_AND_SIZE_OR_UPLOAD_A_NEW_IMAGE)}
      </Typography.Text>
      <br />
      <br />
      <Row gutter={20} justify="space-between">
        <Col lg={11} xl={11} md={11} sm={24} xs={24} className="mr-5">
          <canvas ref={previewCanvasRef} />
          <div className="new-img-wrapper">
            {imgSrc ? (
              <img
                src={imgSrc}
                className="new-img"
                style={{
                  transform: `rotateZ(${degree}deg)`,
                }}
                alt="new image"
              />
            ) : (
              <img src={profileIcons.user_avatar.icon} className="img-avatar" />
            )}
          </div>
          <Row>
            <img onClick={onRotateLeft} src={profileIcons.rotate_right.icon} alt="rotate left icon" />
            &nbsp;&nbsp;&nbsp;
            <img onClick={onRotateRight} src={profileIcons.rotate_left.icon} alt="rotate right icon" />
            &nbsp;&nbsp;&nbsp;
            <img src={icons.remove.icon} onClick={() => setImageSrc(null)} alt="remove icon" />
          </Row>
        </Col>
        <Col lg={11} xl={11} md={11} sm={24} xs={24} className="mr-5">
          <Upload.Dragger
            type="select"
            name="avatar"
            customRequest={customRequest}
            listType="picture-card"
            showUploadList={false}
            accept="image/png, image/jpeg"
            onChange={handleChange}
          >
            <img src={profileIcons.plus_circle.icon} alt="plus circle icon" />
            <br />
            <Typography.Text>{t(CLICK_OR_DRAG_DROP_FILES_HERE_TO_UPLOAD)}</Typography.Text>
          </Upload.Dragger>
          <Row>
            <Typography.Text>{t(YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE)}</Typography.Text>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
