import React, { useState } from 'react';
import { Button, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { ADD_VIDEO, ADD_YOUTUBE_LINK, PROFILE_VIDEOS } from '../../../../../locales/strings';
import { PlusOutlined } from '@ant-design/icons';
import ProfileVideos from '../../../../professionals/complete_profile/gallery_videos';
import { PROFESSIONAL } from '../../../../../app/settings';
import { Client } from '../../../../../API';
import Separator from '../../../../../components/separator';
import { useModal } from '../../../../../app/providers/modal';
import { UploadVideo } from '../upload_video';
import { ModalTitle } from '../../../../../components/modal_title';
import { profileIcons } from '../../../../../assets/icons/profile';
import { PrivateProfileHeader } from '../profile_header';

interface Props {
  client: Client;
}
export const ProfessionalVideos = ({ client }: Props) => {
  const { t } = useTranslation();
  const { showModal, setModalVisible } = useModal();
  const { id } = client;
  const [isForceRefresh, setIsForceRefresh] = useState<boolean>(false);

  const onClick = () => {
    showModal(
      <ModalTitle icon={profileIcons.player} title={t(ADD_YOUTUBE_LINK)} />,
      <UploadVideo setModalVisible={setModalVisible!} setIsForceRefresh={setIsForceRefresh} />,
      'photos-vidoes-container modal-with-custom-footer upload-video-modal modal-wrapper',
      '',
      <div />
    );
  };

  return (
    <>
      <PrivateProfileHeader
        title={t(PROFILE_VIDEOS)}
        toolbar={
          <Button
            icon={<PlusOutlined className="edit-profile__action-button__icon" />}
            className="edit-profile__action-button"
            onClick={onClick}
          >
            {t(ADD_VIDEO)}
          </Button>
        }
      />
      <div className="photos-vidoes-container">
        {client.id && (
          <>
            <Separator vertical={10} />
            <ProfileVideos
              paginationProps={{ resourceId: id }}
              queryParams={{ id }}
              isForceRefresh={isForceRefresh}
              type={PROFESSIONAL}
            />
          </>
        )}
      </div>
    </>
  );
};
