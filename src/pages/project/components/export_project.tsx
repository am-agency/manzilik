import { Button, Col, message, Row } from 'antd';
import React, { FunctionComponent } from 'react';
import { LINK_COPIED, SEND } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import icons from '../../../assets/icons';
import { useModal } from '../../../app/providers/modal';
import SendMessageForm from '../../../components/send_message_form';
import { useLocation } from 'react-router-dom';
import { ModalTitle } from '../../../components/modal_title';
import { SEND_BY_EMAIL } from '../../../locales/strings';
import { Project } from '../../../components/idea/types';
const { REACT_APP_BASE_URL } = process.env;

interface Props {
  project?: Project;
}

export const ExportProject: FunctionComponent<Props> = ({ project }: Props) => {
  const { t } = useTranslation();
  const { showModal } = useModal();
  const title = project?.title;
  const ideaId = project?.ideas && project?.ideas[0]?.id;
  const pathname = `/idea/${title}/${ideaId}`;

  const onShareProject = () => {
    navigator.clipboard.writeText(REACT_APP_BASE_URL + pathname);
    message.success(`${t(LINK_COPIED)}: ${REACT_APP_BASE_URL + pathname}`);
  };

  return (
    <>
      <Col span={24}>
        <Button
          type="text"
          icon={<img src={icons.move.icon} alt="move-icon" />}
          onClick={() =>
            showModal(
              <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
              <SendMessageForm project={project} />,
              'send-email-modal-wrapper modal-wrapper',
              SEND
            )
          }
        >
          {t(icons.email.title)}
        </Button>
        <br />
        {project?.ideas?.length !== 0 && (
          <Button type="text" icon={<img src={icons.share.icon} alt="share-icon" />} onClick={onShareProject}>
            {t(icons.copy.title)}
          </Button>
        )}
      </Col>
    </>
  );
};
