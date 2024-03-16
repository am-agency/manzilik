import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import { Entity } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { useMultiIdeasOperations } from '../../../app/providers/multi_idea_operations_provider';
import { IDEA, IdeaDestination } from '../../../app/settings';
import { IdeaCard } from '../../../components/idea';
import { BaseEntity, Project } from '../../../components/idea/types';
import { DELETE, DONE, MOVE, SELECT_ALL, THERE_ARE_NO_DATA } from '../../../locales/strings';
import { checkIfProjectIdeaExist, toArrayOrEmpty } from '../../idea/utils';
import { listProjectEntities } from '../api';
import { WideIdeaCardSkeleton } from '../../../components/skeletons/cards_grid_skeleton';
import { withPagination, WithPaginationProps } from '../../../app/hooks/with_pagination';
import { LOADING_UPLOADING_IDEA_IMAGE } from '../../../app/providers/main/loading_constants';
import icons from '../../../assets/icons';

export interface UrlParams {
  id: string;
}

interface Props extends UrlParams {
  newIdeas?: BaseEntity[];
  project?: Project;
  tag?: string;
  setIsForceRefresh?: Function;
}

const MyIdeasListComponent: FunctionComponent<WithPaginationProps<BaseEntity> & Props> = (
  props: WithPaginationProps<BaseEntity> & Props
) => {
  const { newIdeas, project, tag, list, setIsForceRefresh } = props;
  const { multiIdeasOperationProviderState, updateProviderState } = useMultiIdeasOperations();
  const { t } = useTranslation();
  const {
    isVisible: multiOperationsVisible,
    projectIdeaList,
    operation,
    status: operationStatus,
  } = multiIdeasOperationProviderState;

  const [selectAll] = useState<boolean>(false);
  const { loadingMap } = useMainContext();
  const ideasForTag = tag == IDEA || !tag ? toArrayOrEmpty(newIdeas) : [];
  const [indexOfDefaultIdea, setIndexOfDefaultIdea] = useState<number | null>(null);

  if (tag == IDEA || !tag) {
    list?.concat(ideasForTag);
  }

  useEffect(() => {
    if (list && project?.default_idea?.id) {
      const indexOfDefaultIdeaInList = list?.findIndex((elm) => elm.entity_id === project?.default_idea?.id);
      setIndexOfDefaultIdea(indexOfDefaultIdeaInList!);
    }
  }, [list, project?.default_idea?.id]);

  // @TODO: should handle the coming list in a better way from the `withPagination` itself
  list?.forEach((elm) =>
    newIdeas?.find((item) => {
      if (elm.entity_id == item.id) {
        elm.photo = item.photo;
        return item;
      }
    })
  );

  const onSelectIdeaForOperations = (projectIdea: Entity) => {
    setIsForceRefresh?.(false);
    // Check if the idea is already selected
    const isExist = projectIdeaList?.find((elem) => elem.entity_id === projectIdea.entity_id);
    let filteredProjectIdeas;
    if (isExist) {
      // Delete/De-select idea if existed
      filteredProjectIdeas = projectIdeaList?.filter((elem) => elem.entity_id !== projectIdea.entity_id);
    } else {
      // Add idea to list
      filteredProjectIdeas = [projectIdea, ...toArrayOrEmpty(projectIdeaList)];
    }
    updateProviderState({ projectIdeaList: filteredProjectIdeas! });
  };

  const onSelectAllIdeas = () => {
    updateProviderState({
      projectIdeaList: list,
    });
  };

  const checkIfOperationMoveOrDelete = (operation?: string) => {
    return operation === MOVE || operation === DELETE;
  };

  const postIdeaOperation = (entitiesList: BaseEntity[] = [], operationType?: string) => {
    if (
      (operationStatus === DONE && checkIfOperationMoveOrDelete(operation)) ||
      checkIfOperationMoveOrDelete(operationType)
    ) {
      setIsForceRefresh?.(true);
    }
  };

  useEffect(() => {
    postIdeaOperation(projectIdeaList);
  }, [operationStatus]);

  return (
    <>
      {multiOperationsVisible && (
        <div>
          <Checkbox checked={selectAll} onChange={onSelectAllIdeas}>
            {t(SELECT_ALL)}
          </Checkbox>
        </div>
      )}

      <Row gutter={20} justify="start" align="middle" className="ideas">
        {list?.map((elm, index) => {
          return (
            <Col xl={6} lg={6} md={8} sm={24} xs={24} key={elm.id}>
              <div className="card-container">
                {indexOfDefaultIdea === index && (
                  <div className="default-idea-icon">
                    <img src={icons.default_idea} alt="default-idea-icon" />
                  </div>
                )}

                <IdeaCard
                  project={project as Project}
                  entity={elm}
                  organizeIdeas={multiOperationsVisible}
                  selectIdeaForOperation={onSelectIdeaForOperations}
                  isSelected={checkIfProjectIdeaExist(projectIdeaList!, elm)}
                  postIdeaOperation={postIdeaOperation}
                  ideaDestination={IdeaDestination.MyIdeas}
                />
              </div>
            </Col>
          );
        })}
        {loadingMap[LOADING_UPLOADING_IDEA_IMAGE] ? (
          <Col xl={6} lg={6} md={8} sm={24} xs={24}>
            <WideIdeaCardSkeleton />
          </Col>
        ) : (
          list && list?.length == 0 && <div className="no-entities-data"> {t(THERE_ARE_NO_DATA)} </div>
        )}
      </Row>
    </>
  );
};

const MyIdeasList = withPagination<BaseEntity, Props>(
  listProjectEntities,
  // @ts-ignore
  MyIdeasListComponent,
  false,
  LOADING_UPLOADING_IDEA_IMAGE,
  {
    dataListKey: 'ideasList',
  }
);
export { MyIdeasList };
