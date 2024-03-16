import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
// components
import { Button, Col, Form, FormInstance, Input, message, Row, Select, Typography } from 'antd';
// types
import { Client, Idea, Project, RoomType } from '../../../../API';
//strings
import {
  BY,
  DESCRIPTION,
  SELECT_PROJECT,
  WHAT_DO_YOU_LIKE_ABOUT_THIS_IDEA,
  SAVED_SUCCESSFULLY,
  CREATE_PROJECT,
} from '../../../../locales/strings';
// hooks
import { useMainContext } from '../../../../app/providers/main';
import { useTranslation } from 'react-i18next';
// utils
import { getLayoutDirection } from '../../../../app/layouts';
// api
import { listMyProjects } from '../../../projects/api';
import { saveEntityToProject } from '../../../project/api';
import { ProjectItem } from '../../components/project_item';
import { getUserName } from '../../../../utils';
import { IDEA } from '../../../../app/settings';
import { BaseEntity } from '../../../../components/idea/types';
import icons from '../../../../assets/icons';
import Separator from '../../../../components/separator';
import CreateNewProject from './components/create_new_project';
import * as analytics from '../../../../analytics';

const { Option } = Select;

interface Props {
  projectId?: string;
  entity?: BaseEntity;
  client: Client;
  projectIdeaList?: Idea[];
  form?: FormInstance;
  roomTypesList?: RoomType[];
  postSaveIdea?: Function;
  tag: string;
}

export const SaveIdeaForm: FunctionComponent<Props> = ({
  entity,
  client,
  form,
  projectId,
  postSaveIdea,
  roomTypesList,
}: Props) => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [openCreateNewProject, toggleCreateNewProject] = useState<boolean>(false);
  const { requestApi } = useMainContext();
  const { t, i18n } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRef: any = useRef();

  const getProjectsList = () => {
    requestApi(listMyProjects, { limit: 20, offset: 0 }, (myProjects: { results: Project[] }, error: string) => {
      setLoadingProjects(false);
      if (error) {
        return;
      }
      const projectsListFiltered = myProjects.results.filter((element) => element?.id !== projectId);
      const firstProject = projectsListFiltered?.length > 0 ? projectsListFiltered?.[0] : null;
      setProjectsList(projectsListFiltered);
      setSelectedProject(firstProject?.id!);
    });
  };

  const onFormFinish = (values: { description: string }) => {
    requestApi(
      saveEntityToProject,
      {
        project_id: selectedProject,
        id: entity?.id,
        description: values.description,
      },
      (response: BaseEntity, error: string) => {
        if (error) {
          postSaveIdea?.(false);
          return;
        }
        postSaveIdea?.(true);
        analytics.PublishEvent(new analytics.AnalyticsSaveItemEvent());
        message.success(t(SAVED_SUCCESSFULLY));
      }
    );
  };

  useEffect(() => {
    getProjectsList();
  }, [projectId]);

  const handleOnSelect = (val: string) => {
    if (val === 'add') {
      toggleCreateNewProject(true);
      return;
    }
    setSelectedProject(val);
    setDropdownOpen(false);
    selectRef?.current?.blur();
  };

  const postCreateProject = (newProject: Project) => {
    setProjectsList([newProject, ...projectsList]);
    setSelectedProject(newProject?.id!);
    toggleCreateNewProject(false);
  };

  return (
    <Form form={form} onFinish={onFormFinish} className="form">
      {openCreateNewProject && (
        <CreateNewProject
          roomTypesList={roomTypesList}
          postCreateProject={postCreateProject}
          onCancel={() => toggleCreateNewProject(false)}
        />
      )}
      <Row gutter={40}>
        <Col xl={7} lg={7} md={12} sm={24} xs={24} className="left-side-wrapper">
          <div className="img-wrapper">
            <img src={entity?.photo!} className="img-fit-content rounded-top-border" />
          </div>
          {entity?.tag === IDEA && <Typography.Text className="img-title">{entity?.description} </Typography.Text>}
          <br />
          <strong>
            <Typography.Text>{entity?.title}</Typography.Text>
          </strong>
          <br />
          {client && (
            <Typography.Text className="client">
              <strong>{t(BY)}</strong>
              &nbsp;
              {getUserName(client)}
            </Typography.Text>
          )}
        </Col>
        <Col xl={17} lg={17} md={12} sm={24} xs={24}>
          <Typography.Text>{t(SELECT_PROJECT)}</Typography.Text>
          <Select
            ref={selectRef}
            loading={loadingProjects}
            dropdownClassName={`select-a-project-list ${getLayoutDirection(i18n.language)}`}
            onSelect={handleOnSelect}
            open={dropdownOpen}
            showArrow
            onFocus={() => {
              setDropdownOpen(true);
            }}
            onBlur={() => {
              if (!projectsList.length) {
                setSelectedProject(undefined);
              }
              setDropdownOpen(false);
            }}
            showSearch
            optionFilterProp="label"
            value={selectedProject}
          >
            {projectsList?.map((current) => (
              <Option
                className="select-project-list-item"
                key={current?.id!}
                value={current?.id!}
                label={current?.title}
              >
                <ProjectItem project={current} />
              </Option>
            ))}
            <Option value="add" className="select-project-list-item">
              <Row align="middle">
                <Button type="text" icon={<img src={icons.add_project.icon} />} className="square-40" />
                <Separator horizontal={10} />
                <Typography.Text className="add-project-btn-text">{t(CREATE_PROJECT)}</Typography.Text>
              </Row>
            </Option>
          </Select>

          <Typography.Text>{t(DESCRIPTION)}</Typography.Text>
          <Form.Item name="description">
            <Input.TextArea placeholder={t(WHAT_DO_YOU_LIKE_ABOUT_THIS_IDEA)} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
