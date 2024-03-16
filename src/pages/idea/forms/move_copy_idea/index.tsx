import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
// components
import { Button, Col, Form, FormInstance, Row, Select, Typography } from 'antd';
// types
import { Project, RoomType } from '../../../../API';
//strings
import { COPY, CREATE, CREATE_PROJECT, MOVE, MOVE_IDEA, SAVE, SELECT_PROJECT } from '../../../../locales/strings';
// hooks
import { useMainContext } from '../../../../app/providers/main';
import { useTranslation } from 'react-i18next';
// utils
import { getLayoutDirection } from '../../../../app/layouts';
// api
import { listMyProjects } from '../../../projects/api';
import { copyEntity, moveIdeaToProject } from '../../api';
import { DONE } from '../../../projects/constants';
import { ProjectItem } from '../../components/project_item';
import { BaseEntity } from '../../../../components/idea/types';
import Separator from '../../../../components/separator';
import icons from '../../../../assets/icons';
import { ideaIcons } from '../../../../assets/icons/idea';
import AddNewProject from '../../../projects/add_new_project';
import { ModalTitle } from '../../../../components/modal_title';
import { useModal } from '../../../../app/providers/modal';
import CreateNewProject from '../save_idea/components/create_new_project';

const { Option } = Select;

const getIdeaOperation = (method: string) => {
  switch (method) {
    case MOVE:
      return moveIdeaToProject;
    case COPY:
      return copyEntity;
    default:
      return moveIdeaToProject;
  }
};

interface Props {
  projectId: string;
  projectIdeaList?: BaseEntity[];
  form?: FormInstance;
  method: string;
  postIdeaOperation?: Function;
  clearIdeasSelection?: Function;
  roomTypesList?: RoomType[];
}

export const MoveOrCopyIdeaForm: FunctionComponent<Props> = (props: Props) => {
  const { postIdeaOperation, projectIdeaList, form, method, projectId, clearIdeasSelection, roomTypesList } = props;
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>();
  const [dropdownOpen, openDropDown] = useState<boolean>(false);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [openCreateNewProject, toggleCreateNewProject] = useState<boolean>(false);
  const { requestApi } = useMainContext();
  const { t, i18n } = useTranslation();

  // This ref was hard to get it's type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRef: any = useRef();

  const getProjectsList = () => {
    requestApi(listMyProjects, { limit: 20, offset: 0 }, (myProjects: { results: Project[] }, error: string) => {
      if (error) {
        return;
      }
      setLoadingProjects(false);
      const projectsListFiltered = myProjects.results.filter((element) => element?.id !== projectId);
      const firstProject = projectsListFiltered?.length > 0 ? projectsListFiltered?.[0] : null;
      setProjectsList(projectsListFiltered);
      setSelectedProject(firstProject?.id!);
    });
  };

  const onFormFinish = () => {
    const ids = projectIdeaList?.map((elm) => {
      return elm.entity_id;
    });
    requestApi(
      getIdeaOperation(method),
      {
        source_project_id: projectId,
        destination_project_id: selectedProject,
        ids: ids,
      },
      (response: { message: string }, error: string) => {
        if (error) {
          return;
        }
        if (response?.message === DONE && method === MOVE) {
          postIdeaOperation?.(projectIdeaList, method);
        }
        clearIdeasSelection?.();
      }
    );
  };

  useEffect(() => {
    getProjectsList();
  }, [projectId]);

  const handleOnSelect = (val: string) => {
    if (val === 'add') {
      toggleCreateNewProject(true);
    }
    setSelectedProject(val);
    openDropDown(false);
    selectRef?.current?.blur();
  };

  const postCreateProject = (newProject: Project) => {
    setProjectsList([newProject, ...projectsList]);
    setSelectedProject(newProject?.id!);
    toggleCreateNewProject(false);
  };

  return (
    <Form form={form} onFinish={onFormFinish}>
      {openCreateNewProject && (
        <CreateNewProject
          postCreateProject={postCreateProject}
          roomTypesList={roomTypesList}
          onCancel={() => toggleCreateNewProject(false)}
        />
      )}
      <Col span={24}>
        <Typography.Text>{t(SELECT_PROJECT)}</Typography.Text>
        <Row>
          <Select
            ref={selectRef}
            loading={loadingProjects}
            dropdownClassName={`select-a-project-list ${getLayoutDirection(i18n.language)}`}
            onSelect={handleOnSelect}
            open={dropdownOpen}
            showArrow
            onFocus={() => {
              openDropDown(true);
            }}
            onBlur={() => {
              if (!projectsList.length) {
                setSelectedProject(undefined);
              }
              openDropDown(false);
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
        </Row>
      </Col>
    </Form>
  );
};
