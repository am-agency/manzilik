import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { Professional, Video } from '../../../../../API';
import { PROFESSIONAL } from '../../../../../app/settings';
import { profileIcons } from '../../../../../assets/icons/profile';
import Separator from '../../../../../components/separator';
import { ADD_VIDEO, PLEASE_ENTER_VALID_YOUTUBE_LINK, VIDEOS } from '../../../../../locales/strings';
import { checkEmptySimpleString, isYouTubeLink } from '../../../../../utils';
import ProfileVideos from '../../gallery_videos';

interface Props {
  displayedVideos: Video[];
  setDisplayedVideos: Function;
  professional: Professional;
  isForceRefresh: boolean;
}

export const StepThree: FunctionComponent<Props> = ({
  professional,
  displayedVideos,
  setDisplayedVideos,
  isForceRefresh,
}: Props) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const { t } = useTranslation();
  const { id } = professional;

  useEffect(() => {
    setIsValidUrl(isYouTubeLink(videoUrl));
  }, [videoUrl]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value) {
      setVideoUrl(value);
    } else {
      setVideoUrl('');
    }
  };

  const onAddVideo = () => {
    if (checkEmptySimpleString(videoUrl)) {
      const video = {
        id: new Date(),
        video: videoUrl,
      };
      setDisplayedVideos((prevVideos: Video[]) => [...prevVideos, video]);
      setVideoUrl('');
    }
  };

  const onDeleteVideo = (id: string) => {
    const filteredUrls = displayedVideos.filter((elm) => elm.id !== id);
    setDisplayedVideos(filteredUrls);
  };

  return (
    <div className="video-player">
      <Typography.Text className="videos-label">{t(VIDEOS)}</Typography.Text>
      <Row justify="space-between" align="middle">
        <Col span={17}>
          <Input placeholder="https://www.youtube.comm" value={videoUrl} onChange={onChange} className="video-url" />
        </Col>
        <Col span={6}>
          <Button onClick={onAddVideo} className="submit-btn" disabled={!isValidUrl}>
            {t(ADD_VIDEO)}
          </Button>
        </Col>
      </Row>
      {!isValidUrl && videoUrl.length > 0 && (
        <Typography.Text className="error-message">{t(PLEASE_ENTER_VALID_YOUTUBE_LINK)}</Typography.Text>
      )}
      <Separator vertical={13} />
      <Row className="videos-wrapper upload-videos" gutter={[16, 12]}>
        {displayedVideos.map((elm) => {
          return (
            <Col xl={12} lg={12} md={12} sm={24} xs={24} className="video" key={elm.id}>
              <div className="overlay-wrapper">
                <ReactPlayer url={elm.video!} width={'100%'} height={'100%'} controls={true} />
                <div className="thumbnail-overlay img-fit-content rounded-border" />
              </div>

              {elm.id && (
                <img className="delete-icon" src={profileIcons.trashCan} onClick={() => onDeleteVideo(elm.id)} />
              )}
            </Col>
          );
        })}
      </Row>
      {professional?.client?.id && (
        <ProfileVideos
          paginationProps={{ resourceId: professional?.client?.id }}
          queryParams={{ id }}
          isForceRefresh={isForceRefresh}
        />
      )}
    </div>
  );
};
