import { Button, Col, Divider, Row, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { UpdateProjectInput } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { useModal } from '../../../app/providers/modal';
import { EditProjectModal } from './edit_project_modal';
import { updateProject } from '../api';

import editIcon from '../../../assets/icons/edit.svg';
import titleIcon from '../../../assets/icons/idea.svg';

import {
  CATEGORY_TYPE,
  EDIT_PROJECT_INFO,
  ENTER_PROJECT_CATEGORY,
  ENTER_PROJECT_DESCRIPTION,
  ENTER_PROJECT_STATUS,
  PRIVATE_WORD,
  PUBLIC_WORD,
  PUBLISH_STATUS,
} from '../../../locales/strings';
import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router';
import { PROJECTS_ROUTE } from '../../../utils/routes';
import { deleteProject } from '../../projects/api';
import { toArrayOrEmpty } from '../../idea/utils';
import { Project } from '../../../components/idea/types';
import Separator from '../../../components/separator';
import { ideaIcons } from '../../../assets/icons/idea';
import { PRIVATE } from '../../projects/constants';

interface Props {
  projectDetails: Project;
}

export const ProjectDetails = ({ projectDetails }: Props) => {
  const { showModal } = useModal();
  const { requestApi } = useMainContext();
  const history = useHistory();
  const { t } = useTranslation();
  const [project, setProject] = useState<Project>();
  const projectTitle = project?.title;
  const projectDescription = project?.description || t(ENTER_PROJECT_DESCRIPTION);
  const projectStatus = (project?.visibility == PRIVATE ? t(PRIVATE_WORD) : t(PUBLIC_WORD)) || t(ENTER_PROJECT_STATUS);
  const projectRoom = (project && project.room_type?.title) || t(ENTER_PROJECT_CATEGORY);

  const onEditProjectSubmit = ({ title, description, visibility, room_type_id }: UpdateProjectInput) => {
    requestApi(
      updateProject,
      {
        id: project?.id,
        title,
        description,
        room_type_id,
        visibility,
      },
      (project: Project, error: string) => {
        if (error) {
          return;
        }
        setProject(project);
      }
    );
  };

  const onDeleteProject = (id: string) => {
    requestApi(deleteProject, id, (result: { deleteProject: Project }) => {
      if (result.deleteProject) {
        // go to projects list page if project deleted
        history.push(PROJECTS_ROUTE);
      }
    });
  };

  const onEditProject = () => {
    showModal(
      <>
        <img src={titleIcon} /> {t(EDIT_PROJECT_INFO)}
      </>,
      <EditProjectModal
        onEditProjectSubmit={onEditProjectSubmit}
        onDeleteProject={onDeleteProject}
        project={project!}
      />,
      'modal-wrapper modal-with-custom-footer edit-project-modal-wrapper',
      '',
      <div />
    );
  };

  useEffect(() => {
    setProject(projectDetails);
  }, [projectDetails]);

  if (!projectDetails) {
    return <Col xl={12} lg={12} md={12} sm={24} xs={24} />;
  }

  const idea = toArrayOrEmpty(projectDetails.ideas)[0];

  return (
    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
      <Row gutter={18} className="project-details">
        <Col xl={3} lg={4} md={6} sm={6} xs={6}>
          {idea?.photo ? (
            <img className="img-fit-content project-pic" alt={`${idea?.title}`} src={idea?.photo!} />
          ) : (
            <div className="img-fit-content project-pic empty-img" />
          )}
        </Col>
        <Col xl={20} lg={20} md={18} sm={18} xs={18}>
          <Row align="middle">
            <span className="text title">{projectTitle}</span>
          </Row>
          <Separator vertical={3} />

          <Row align="middle">
            {!project?.visibility ? (
              <span onClick={onEditProject} className="text status no-data clickable">
                {projectStatus}
              </span>
            ) : (
              <>
                <Typography.Text className="text"> {t(PUBLISH_STATUS)} </Typography.Text>
                <Divider type="vertical" className="inner-divider" />
                <strong className="text status description">{projectStatus}</strong>
              </>
            )}

            <Divider type="vertical" />

            {!project?.room_type ? (
              <span onClick={onEditProject} className="text no-data clickable">
                {projectRoom}
              </span>
            ) : (
              <>
                <Typography.Text className="text"> {t(CATEGORY_TYPE)} </Typography.Text>
                <Divider type="vertical" className="inner-divider" />
                <strong className="text">{projectRoom}</strong>
              </>
            )}
          </Row>
          <Separator vertical={3} />

          <Row align="middle">
            {!project?.description ? (
              <span onClick={onEditProject} className="text description no-data clickable">
                {projectDescription}
              </span>
            ) : (
              <span className="text description">{projectDescription}</span>
            )}
          </Row>
          <Separator vertical={6} />
          <Button className="edit-btn" onClick={onEditProject} icon={<img src={ideaIcons.edit} />}>
            &nbsp;&nbsp;&nbsp; {t(EDIT_PROJECT_INFO)} &nbsp;&nbsp;&nbsp;
          </Button>
        </Col>
      </Row>
    </Col>
  );
};
