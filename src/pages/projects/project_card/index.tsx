import { Card, CardProps, Col, Row, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ARE_YOU_SURE_DELETE_MSG, DISCUSSION, EDIT_PROJECT_INFO, NO, PHOTO, YES } from '../../../locales/strings';
import { Project, UpdateProjectInput } from '../../../API';
import { Link } from 'react-router-dom';
import icons from '../../../assets/icons';
import DropdownPopover from '../../../components/dropdown_popover';
import { getLayoutDirection } from '../../../app/layouts';
import { useModal } from '../../../app/providers/modal';
import { PopConfirm } from '../../../components/pop_confirm';
import { useMainContext } from '../../../app/providers/main';
import { updateProject } from '../../project/api';
import { ModalTitle } from '../../../components/modal_title';
import { EditProjectModal } from '../../project/project_details/edit_project_modal';
import titleIcon from '../../../assets/icons/idea.svg';
import { deleteProject } from '../api';
import { Status } from '../types';
import { toArrayOrEmpty } from '../../idea/utils';

interface Props {
  project: Project;
}

export const ProjectCard: FunctionComponent<CardProps & Props> = (props: CardProps & Props) => {
  const { t, i18n } = useTranslation();
  const { project: currentProject } = props;
  const { showModal } = useModal();
  const { requestApi } = useMainContext();
  const [project, setProject] = useState(currentProject);
  const [isProjectDeleted, setIsProjectDeleted] = useState<boolean>(false);

  const onDeleteProject = (id: string) => {
    requestApi(deleteProject, id, (result: { deleteProject: Project }, error: string) => {
      if (error) {
        return;
      }
      setIsProjectDeleted(true);
    });
  };

  const onEditProject = () => {
    showModal(
      <ModalTitle title={t(EDIT_PROJECT_INFO)} icon={titleIcon} />,
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

  const onEditProjectSubmit = (values: UpdateProjectInput) => {
    const { title, description, visibility, room_type_id } = values;
    requestApi(
      updateProject,
      {
        id: project!.id,
        title,
        description,
        visibility,
        room_type_id,
      },
      (response: Project, error: string) => {
        if (error) {
          return;
        }
        setProject({ ...response, ideas: project.ideas });
      }
    );
  };

  if (project.status === Status.DELETED) {
    return null;
  }

  const idea = project?.default_idea;

  if (isProjectDeleted) {
    return <div />;
  }

  return (
    <Col xl={8} lg={8} md={12} xs={24} sm={24}>
      <div className="project-card">
        <DropdownPopover
          content={
            <div className="popover-item">
              <PopConfirm
                title={`${t(ARE_YOU_SURE_DELETE_MSG, { projectName: project?.title })}`}
                actionText={
                  <>
                    <img src={icons.remove.icon} />
                    {t(icons.remove.title)}
                  </>
                }
                okText={t(YES)}
                cancelText={t(NO)}
                onConfirm={() => onDeleteProject(project.id!)}
              />
            </div>
          }
          trigger="click"
        >
          <div className={`ellipsis-btn ellipsis-btn-${getLayoutDirection(i18n.language)}`}>
            <img src={icons.options.icon} />
          </div>
        </DropdownPopover>
        <Card
          bordered
          cover={
            <div className="cover-img-wrapper">
              {idea?.photo ? (
                <img className="rounded-top-border img-fit-content" alt={`${idea?.title}`} src={idea?.photo} />
              ) : (
                <div className="rounded-top-border img-fit-content empty-img" />
              )}

              <div className="thumbnail-overlay thumbnail-overlay-gradient img-fit-content rounded-top-border"></div>
            </div>
          }
        >
          <Meta
            title={
              <Row>
                <Link className="project-name-link" to={`/project/${project?.id}`}>
                  <span className="project-name">{project.title}</span>
                </Link>
                <div onClick={onEditProject}>
                  <img src={icons.edit.icon} className="edit-icon" />
                </div>
              </Row>
            }
            description={
              <Link to={`/project/${project.id}`}>
                <Typography.Text>{`${t(DISCUSSION, {
                  count: project.discussions_count!,
                })}`}</Typography.Text>
                <Typography.Text className="dot-divider">.</Typography.Text>
                <Typography.Text>{`${t(PHOTO, {
                  count: project.ideas_count!,
                })}`}</Typography.Text>
              </Link>
            }
          />
        </Card>
      </div>
    </Col>
  );
};
