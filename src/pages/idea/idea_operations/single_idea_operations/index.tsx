import React, { useEffect } from 'react';
// Hooks
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../app/providers/modal';
// strings
import { COPY, MOVE, MOVE_IDEA, REMOVE, SEND, SEND_BY_EMAIL, SET_AS_MAIN } from '../../../../locales/strings';
// components
import icons from '../../../../assets/icons';
import { ModalTitle } from '../../../../components/modal_title';
import SendMessageForm from '../../../../components/send_message_form';
import { MoveOrCopyIdeaForm } from '../../forms/move_copy_idea';
import { DeleteIdeaForm } from '../../forms/delete_idea';
import { BaseEntity } from '../../../../components/idea/types';
import { useMainContext } from '../../../../app/providers/main';
import { setProjectDefaultIdeaInput } from '../../../../API';
import { setProjectDefaultIdea } from '../../../project/api';

interface Props {
  entity: BaseEntity;
  projectId: string;
  postIdeaOperation?: Function;
  setSelectedIdeaId?: Function;
}

export const SingleIdeaOperations = (props: Props) => {
  const { t } = useTranslation();
  const { showModal } = useModal();
  const { entity, postIdeaOperation, projectId, setSelectedIdeaId } = props;
  const { requestApi } = useMainContext();

  const showMoveIdeaModal = () => {
    showModal(
      <ModalTitle title={t(MOVE_IDEA)} icon={icons.move.icon} />,
      <MoveOrCopyIdeaForm
        projectId={projectId}
        projectIdeaList={[entity]}
        method={MOVE}
        postIdeaOperation={postIdeaOperation}
      />,
      'modal-wrapper move-idea-modal',
      MOVE
    );
  };

  const showDeleteIdeaModal = () => {
    showModal(
      <ModalTitle title={t(REMOVE)} icon={icons.remove.icon} />,
      <DeleteIdeaForm projectId={projectId} projectIdeaList={[entity]} postIdeaOperation={postIdeaOperation} />,
      'modal-wrapper remove-idea-modal',
      REMOVE
    );
  };

  const showCopyIdeaModal = () => {
    showModal(
      <ModalTitle title={t(COPY)} icon={icons.copy.icon} />,
      <MoveOrCopyIdeaForm projectId={projectId} projectIdeaList={[entity]} method={COPY} />,
      'modal-wrapper move-idea-modal',
      COPY
    );
  };

  const showEmailIdeaModal = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm idea={entity} shareItem="idea" />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  const onSetProjectIdeaAsMain = (input: setProjectDefaultIdeaInput) => {
    setSelectedIdeaId?.(input.idea);
    requestApi(
      setProjectDefaultIdea,
      { project: input.project, idea: input.idea },
      (res: { message: string }, error: string) => {
        if (error) {
          return;
        }
        window.location.reload();
      }
    );
  };

  return (
    <div className="operations">
      <div
        className="popover-item"
        onClick={() => onSetProjectIdeaAsMain({ project: projectId, idea: entity.entity_id! })}
      >
        <img src={icons.set_as_default} /> {t(SET_AS_MAIN)}
      </div>
      <div className="popover-item" onClick={showMoveIdeaModal}>
        <img src={icons.move.icon} /> {t(icons.move.title)}
      </div>
      <div className="popover-item" onClick={showCopyIdeaModal}>
        <img src={icons.copy.icon} /> {t(icons.copy.title)}
      </div>
      <div className="popover-item" onClick={showDeleteIdeaModal}>
        <img src={icons.remove.icon} /> {t(icons.remove.title)}
      </div>

      <div className="popover-item" onClick={showEmailIdeaModal}>
        <img src={icons.email.icon} /> {t(SEND)}
      </div>
    </div>
  );
};
