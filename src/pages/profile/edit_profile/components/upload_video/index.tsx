import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Button, Form, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { checkEmptySimpleString } from '../../../../../utils';
import Separator from '../../../../../components/separator';
import { CANCEL, CREATE, VIDEO_EXAMPLE, ADD_VALID_YOUTUBE_LINK } from '../../../../../locales/strings';
import { uploadProfessionalVideos } from '../../../../professionals/api';
import { Professional } from '../../../../../API';
import { useMainContext } from '../../../../../app/providers/main';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../../../app/providers/main/loading_constants';

interface Props {
  setModalVisible: Function;
  setIsForceRefresh: Function;
}

export const UploadVideo = ({ setModalVisible, setIsForceRefresh }: Props) => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();

  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value) {
      setVideoUrl(value);
      setIsError(false);
    }
  };

  const onPreviewVideo = () => {
    if (checkEmptySimpleString(videoUrl)) {
      setIsUploaded(true);
    }
  };

  const onCancel = () => {
    setModalVisible(false);
    setVideoUrl('');
    setIsUploaded(false);
  };

  const onFinish = () => {
    setIsForceRefresh(false);
    requestApi(
      uploadProfessionalVideos,
      { videos: [videoUrl] },
      (result: Professional, error: string) => {
        if (error) {
          return;
        }
        setIsForceRefresh(true);
        setModalVisible?.(false);
        setVideoUrl('');
        setIsUploaded(false);
      },
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const onError = () => {
    setIsError(true);
  };

  return (
    <div className="video-player">
      <div className="form">
        <Typography.Text>{t(VIDEO_EXAMPLE)} </Typography.Text> &nbsp;&nbsp;
        <Typography.Text className="video-example">{'https://www.youtube.com'}</Typography.Text>
        <Form.Item>
          <Input value={videoUrl} onChange={onChange} className="video-url" onPressEnter={onPreviewVideo} />
        </Form.Item>
        <Separator vertical={5} />
        {isUploaded && (
          <>
            {!isError ? (
              <div>
                <div className="overlay-wrapper">
                  <ReactPlayer url={videoUrl} width={'359px'} height={'207px'} controls={true} onError={onError} />
                  <div className="thumbnail-overlay img-fit-content rounded-border" />
                </div>
              </div>
            ) : (
              <Row justify="center" align="middle">
                {t(ADD_VALID_YOUTUBE_LINK)}
              </Row>
            )}

            <Row justify="center" className="modal-footer">
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={onFinish}>
                  {t(CREATE)}
                </Button>
              </Form.Item>
              <Separator horizontal={11} />
              <Form.Item>
                <Button onClick={onCancel}> {t(CANCEL)} </Button>
              </Form.Item>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};
