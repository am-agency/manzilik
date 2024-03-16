import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Client, Project } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { useModal } from '../../../../app/providers/modal';
import { withUserAuthenticator } from '../../../../app/providers/user/with_user_authenticator';
import icons from '../../../../assets/icons';
import Avatar from '../../../../components/avatar';
import {
  CREATE_PROJECT,
  VIEW_PROFILE,
  IDEA,
  CREATE,
  VIEW_MORE,
  PROFESSIONAL,
  NO_PROJECTS,
  ADD_NEW_PROJECTS,
} from '../../../../locales/strings';
import { getUserName } from '../../../../utils';
import AddNewProject from '../../../projects/add_new_project';
import tagIcon from '../../../../assets/icons/tag.svg';
import Loader from 'react-spinners/ClipLoader';
import { ModalTitle } from '../../../../components/modal_title';
import { useClient } from '../../../../app/hooks/use_client';
import { ClientBadgesAndRewords } from '../../../clients_landing_page/components/client-padges-and-rewords';
import { CompletePersonalProfile } from '../../../auth/signup/components/complete_basic_profile/complete_personal_profile';
import { useCompletePersonalProfile } from '../../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import EmptyState from '../../../../components/empty_state_component';

const UserBox: FunctionComponent = () => {
  const { userState, requestApi, userName } = useMainContext();

  const { t } = useTranslation();
  const { showModal } = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    clientData: client,
    projectsCount,
    isProjectsLoading,
    projects,
    setProjects,
  } = useContext(SharedStateContext) as SharedStateInterface;
  const history = useHistory();
  const { isCompletePersonalProfile, errors, profile, setProfile, submit, saveSnapshot, restoreSnapshot } =
    useCompletePersonalProfile();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [form] = Form.useForm();

  return (
    <Row className="user-box">
      <Col span={24}>
        <Row className="user-box-header" align="middle">
          <Col xl={5} lg={5} md={5} xs={5} sm={5}>
            <Avatar size={46} className="avatar-lg" src={client?.profile_image || userState?.user?.picture} />
            <Avatar size={46} className="avatar-md" src={client?.profile_image || userState?.user?.picture} />
          </Col>
          <Col xl={14} lg={14} md={14} xs={14} sm={14} className="name-link-wrapper">
            <Typography.Text className="user-name-text" ellipsis>
              {userName}
            </Typography.Text>
            <Typography.Text ellipsis>{t(PROFESSIONAL)}</Typography.Text>
          </Col>
          <Col xl={5} lg={5} md={5} xs={5} sm={5} className="edit-profile">
            <img
              src={icons.edit_profile}
              alt="edit"
              onClick={() => {
                history.push('/edit-profile');
              }}
            />
          </Col>
        </Row>
      </Col>
      <div className="horizontal-line"></div>
      <Col>
        <div className="latest-projects-wrapper">
          <Modal
            visible={showCompleteProfile}
            footer={null}
            onCancel={(e) => {
              restoreSnapshot();
              setShowCompleteProfile(false);
            }}
          >
            <Form
              form={form}
              onFieldsChange={(fields) => {
                fields.forEach((field) => {
                  setProfile((pre) => ({ ...pre, [field.name as string]: field.value }));
                });
              }}
            >
              <CompletePersonalProfile
                onInit={saveSnapshot}
                onComplete={() => {
                  setShowCompleteProfile(false);
                }}
                errors={errors}
                profile={profile}
                setProfile={setProfile}
                submit={async () => {
                  try {
                    const updated = await submit();
                    setShowCompleteProfile(false);
                    return updated;
                  } catch (error) {
                    return Promise.reject();
                  }
                }}
              />
            </Form>
          </Modal>
          <Row
            className="user-box-item"
            onClick={() => {
              if (!isCompletePersonalProfile) {
                setShowCompleteProfile(true);
                return;
              }
              showModal(
                <ModalTitle icon={tagIcon} title={t(CREATE_PROJECT)} />,
                <AddNewProject
                  postAddProject={(newProject: Project) => {
                    if (projects.length < 2) {
                      setProjects((previousProjects) => [...previousProjects, newProject]);
                    }
                    history.push(`/project/${newProject.id}`);
                  }}
                />,
                'modal-wrapper',
                CREATE
              );
            }}
          >
            {projectsCount === 0 ? (
              <div>
                <EmptyState title={t(NO_PROJECTS)} description={t(ADD_NEW_PROJECTS)} image={icons.empty_state} />
              </div>
            ) : null}

            <Typography.Text className="add-project-btn-text">{t(CREATE_PROJECT)}</Typography.Text>
          </Row>
          {isProjectsLoading && (
            <div className="loading-project-placeholder">
              <Loader />
            </div>
          )}
          <div className="horizontal-line"></div>
          <div className="projects-wrapper">
            {projects?.map((project: Project, i) => {
              const photo = project.default_idea && project?.default_idea.photo;
              return (
                <>
                  <Link to={`/project/${project.id}`} key={i}>
                    <Row className="user-box-item" wrap={false}>
                      <div className="square-40">
                        <img src={photo!} className="square-40"></img>
                        <div className="square-40 thumbnail-overlay">
                          <img src={icons.check.icon} />
                        </div>
                      </div>
                      <div className="full-width project-wrapper">
                        <Typography.Text className="project-name-text" ellipsis>
                          {project.title}
                        </Typography.Text>
                        <Typography.Text className="items-number-text">{`${t(IDEA, {
                          count: project.ideas_count!,
                        })}`}</Typography.Text>
                      </div>
                    </Row>
                  </Link>
                  <div className="horizontal-line"></div>
                </>
              );
            })}
          </div>

          {projectsCount > 0 ? (
            <Row>
              <Link to="/projects" className="view-link">
                {t(VIEW_MORE)}
                <span className="projects-count">({projectsCount})</span>
              </Link>
            </Row>
          ) : null}

          {/* <ClientBadgesAndRewords client={client} /> */}
        </div>
      </Col>
    </Row>
  );
};

export default withUserAuthenticator(UserBox, () => <div />);
