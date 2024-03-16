import React from 'react';

// Hooks
import {
  MultiIdeasOperationsState,
  useMultiIdeasOperations,
} from '../../../../app/providers/multi_idea_operations_provider';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../app/providers/modal';
// types
import { Entity } from '../../../../API';
// strings
import { CANCEL, COPY, DELETE, DONE, IDEA, MOVE, MOVE_IDEA, REMOVE } from '../../../../locales/strings';
// utils
import { getLayoutDirection } from '../../../../app/layouts';
// components
import { DeleteIdeaForm } from '../../forms/delete_idea';
import { MoveOrCopyIdeaForm } from '../../forms/move_copy_idea';
import { ModalTitle } from '../../../../components/modal_title';
import icons from '../../../../assets/icons';
import { Row, Col, Typography } from 'antd';
import { BaseEntity } from '../../../../components/idea/types';

interface Props {
  projectId: string;
  cancelOrganizeMode: Function;
  providerState?: MultiIdeasOperationsState;
}

export const MultiIdeasOperations = (props: Props) => {
  const { i18n, t } = useTranslation();
  const { showModal } = useModal();
  const { hideMultiIdeasOperations, updateProviderState, multiIdeasOperationProviderState } = useMultiIdeasOperations();
  const { cancelOrganizeMode, projectId } = props;
  const { projectIdeaList } = multiIdeasOperationProviderState;
  const isButtonDisabled = multiIdeasOperationProviderState?.projectIdeaList?.length === 0;
  const disabledClassName = isButtonDisabled ? 'operation-btn operation-btn-disabled' : 'operation-btn';

  const clearIdeasSelection = () => {
    updateProviderState({ projectIdeaList: [] });
  };

  const showMoveIdeaModal = () => {
    !isButtonDisabled &&
      showModal(
        <ModalTitle title={t(MOVE_IDEA)} icon={icons.move.icon} />,
        <MoveOrCopyIdeaForm
          projectId={projectId}
          projectIdeaList={projectIdeaList}
          clearIdeasSelection={clearIdeasSelection}
          postIdeaOperation={() => {
            updateProviderState({ status: DONE, operation: MOVE });
          }}
          method={MOVE}
        />,
        'modal-wrapper move-idea-modal',
        MOVE
      );
  };

  const showDeleteIdeaModal = () => {
    !isButtonDisabled &&
      showModal(
        <ModalTitle title={t(REMOVE)} icon={icons.remove.icon} />,
        <DeleteIdeaForm
          projectId={projectId}
          projectIdeaList={projectIdeaList}
          postIdeaOperation={() => {
            updateProviderState({ status: DONE, operation: DELETE });
          }}
        />,
        'modal-wrapper remove-idea-modal',
        REMOVE
      );
  };

  const showCopyIdeaModal = () => {
    !isButtonDisabled &&
      showModal(
        <ModalTitle title={t(COPY)} icon={icons.copy.icon} />,
        <MoveOrCopyIdeaForm
          projectId={projectId}
          projectIdeaList={multiIdeasOperationProviderState?.projectIdeaList}
          method={COPY}
        />,
        'modal-wrapper move-idea-modal',
        COPY
      );
  };

  return (
    <div className={`mutli-select-idea-modal ${getLayoutDirection(i18n.language)}`}>
      <Row justify="center" className="mutli-select-idea-inner-content">
        <Col span={22}>
          <Row justify="center" align="middle">
            <div className="number-of-items-text">
              <Typography.Text>{` ${t(IDEA, {
                count: multiIdeasOperationProviderState?.projectIdeaList?.length,
              })}`}</Typography.Text>
            </div>
            <div className="operation-btns-wrapper">
              <div onClick={showMoveIdeaModal} className={disabledClassName}>
                <img src={icons.move.icon} />
                {t(icons.move.title)}
              </div>
              <div onClick={showCopyIdeaModal} className={disabledClassName}>
                <img src={icons.copy.icon} />
                {t(icons.copy.title)}
              </div>
              <div onClick={showDeleteIdeaModal} className={disabledClassName}>
                <img src={icons.remove.icon} />
                {t(icons.remove.title)}
              </div>
            </div>
            <div
              className="cancel-btn"
              onClick={() => {
                cancelOrganizeMode();
                hideMultiIdeasOperations();
              }}
            >
              {t(CANCEL)}
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
