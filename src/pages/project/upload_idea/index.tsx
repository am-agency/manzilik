import React from 'react';
import { Col, Tooltip } from 'antd';
import { useModal } from '../../../app/providers/modal';
import addIcon from '../../../assets/icons/add.svg';
import { ModalTabs } from './modal_tabs';
import photoIcon from '../../../assets/icons/photo.svg';
import { ADD_NEW_IDEA, ADD_PHOTO, CREATE } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { ModalTitle } from '../../../components/modal_title';

interface UploadProps {
  projectId: string;
  onUploadIdeaToProject: Function;
  setIsForceRefresh: Function;
}

export enum MakhzanDestination {
  IDEA = 'IDEA',
  COMMENT = 'COMMENT',
  PROFILE = 'PROFILE',
  GENERAL = 'GENERAL',
  REVIEWS = 'REVIEWS',
  MANZILIKAI = 'MANZILIKAI',
}

export const UploadIdea = ({ projectId, onUploadIdeaToProject, setIsForceRefresh }: UploadProps) => {
  const { showModal, form } = useModal();
  const { t } = useTranslation();

  const onUploadIdea = () => {
    showModal(
      <ModalTitle icon={photoIcon} title={t(ADD_PHOTO)} />,
      <ModalTabs
        projectId={projectId}
        onUploadIdeaToProject={onUploadIdeaToProject}
        form={form}
        setIsForceRefresh={setIsForceRefresh}
      />,
      'upload-idea-modal-wrapper modal-wrapper modal-with-custom-footer',
      '',
      <div />
    );
  };

  return (
    <Tooltip placement="top" title={t(ADD_NEW_IDEA)}>
      <div className="clickable">
        <img src={addIcon} onClick={onUploadIdea} />
      </div>
    </Tooltip>
  );
};
