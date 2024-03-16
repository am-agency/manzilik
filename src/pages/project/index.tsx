import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
// components
import { Col, Row } from 'antd';
// hooks
import MultiIdeasOperationsProvider, {
  useMultiIdeasOperations,
} from '../../app/providers/multi_idea_operations_provider';
import { useParams } from 'react-router-dom';
import { useMainContext } from '../../app/providers/main';

// api
import { getProject } from './api';
// strings
import { PRIVATE } from '../../locales/strings';
// utils
import { BaseEntity, Project } from '../../components/idea/types';
import { useClient } from '../../app/hooks/use_client';
import FailurePage from '../../components/page_not_found';
import ToolBar from './toolbar';
import { MyIdeasList, UrlParams } from './my_idea_list';
import MoreIdeasList from './more_idea_list';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

const ProjectPage: FunctionComponent = () => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { id }: UrlParams = useParams();
  const [project, setProject] = useState<Project>();
  const { hideMultiIdeasOperations } = useMultiIdeasOperations();
  const [isMyIdeasTab, setIsMyIdeasTab] = useState<boolean>(true);
  const [newIdeas, setNewIdeas] = useState<BaseEntity[]>([]);
  const [tag, setTag] = useState<string>();
  const { requestApi } = useMainContext();
  const [isForceRefresh, setIsForceRefresh] = useState<boolean>(false);
  const isProjectOwner = project && client && client?.id === project?.client?.id;
  const isProjectPrivate = project && !isProjectOwner && project?.visibility === PRIVATE;

  const initProject = () => {
    requestApi(getProject, id, (result: Project, error: string) => {
      if (error) {
        return;
      }
      setProject(result);
    });
  };

  const onUploadIdeaToProject = (idea: BaseEntity) => {
    if (project?.ideas?.length === 0) {
      setProject({ ...project, ideas: [idea] });
    }
    setNewIdeas((prevIdeas) => [...prevIdeas, idea]);
  };

  useEffect(() => {
    initProject();
  }, []);

  const onTabClick = (key: string) => {
    if (key === 'myIdeas') {
      setIsMyIdeasTab(true);
    } else {
      setIsMyIdeasTab(false);
      hideMultiIdeasOperations();
    }
  };

  const onFilterClick = (filter: string) => {
    setTag(filter);
  };

  if (isProjectPrivate) {
    return <FailurePage />;
  }

  return (
    <Row justify="center" className="project">
      <Col span={20}>
        <ToolBar
          onTabClick={onTabClick}
          isMyIdeasTab={isMyIdeasTab}
          onUploadIdeaToProject={onUploadIdeaToProject}
          project={project!}
          onFilterClick={onFilterClick}
          tag={tag!}
          setIsForceRefresh={setIsForceRefresh}
        />
        <Row align="middle" justify="space-between">
          <Col
            xl={{ span: 24, order: 2 }}
            lg={{ span: 24, order: 2 }}
            md={{ span: 24, order: 2 }}
            sm={{ span: 24, order: 3 }}
            xs={{ span: 24, order: 3 }}
            className="project-tabs tabs"
          >
            {isMyIdeasTab && id ? (
              <MyIdeasList
                project={project}
                uniqueRef={tag}
                newIdeas={newIdeas}
                queryParams={{ id, tag }}
                inputQueryParams={{ tag }}
                isForceRefresh={isForceRefresh}
                setIsForceRefresh={setIsForceRefresh}
              />
            ) : (
              <MoreIdeasList
                project={project}
                paginationProps={{
                  resourceId: id,
                }}
              />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default () => (
  <MultiIdeasOperationsProvider>
    <ProjectPage />
  </MultiIdeasOperationsProvider>
);
