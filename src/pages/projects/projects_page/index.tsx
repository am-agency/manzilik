import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
// Components
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Tabs } from 'antd';
import { ProfileHeader } from '../../../components/profile_header';
import AddNewProject from '../add_new_project';
import { ProjectsList } from '../projects_list';
// Hooks
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../app/providers/main';
import { useModal } from '../../../app/providers/modal';
import { withUserAuthenticator } from '../../../app/providers/user/with_user_authenticator';
// Translations
import {
  ACTIVITY,
  CREATE,
  CREATE_PROJECT,
  MANZILIK,
  PROFESSIONAL,
  PROJECTS,
  PROJECTS_SEO_DESCRIPTION,
} from '../../../locales/strings';
// API
import { listMyProjects } from '../api';
import { Project } from '../../../API';

import tagIcon from '../../../assets/icons/tag.svg';
import { ModalTitle } from '../../../components/modal_title';
import { useHistory } from 'react-router';

import { listLimit as limit } from '../../../app/settings';
import { useClient } from '../../../app/hooks/use_client';
import { MetaTags } from '../../../components/meta_tags';
import { CompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/complete_personal_profile';
import { useCompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import i18n from '../../../app/i18n';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import { CompleteProfileContext } from '../../../context/complete_profile_context';
import InDismissibleAlert from '../../../components/in_dismissible_alert';
import { COMPLETE_PROFILE_ROUTE } from '../../../utils/routes';

export const TabsPanel: FunctionComponent = () => {
  const { t } = useTranslation();
  const { showModal } = useModal();
  const { requestApi } = useMainContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { isCompletePersonalProfile, errors, profile, setProfile, submit, saveSnapshot, restoreSnapshot } =
    useCompletePersonalProfile();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [form] = Form.useForm();

  const onAddProject = () => {
    if (!isCompletePersonalProfile) {
      setShowCompleteProfile(true);
    } else {
      showModal(
        <ModalTitle icon={tagIcon} title={t(CREATE_PROJECT)} />,
        <AddNewProject
          postAddProject={(newProject: Project) => {
            setProjects((previousProjects) => [...previousProjects, newProject]);
            history.push(`/project/${newProject.id}`);
          }}
        />,
        'modal-wrapper',
        CREATE
      );
    }
  };

  const history = useHistory();

  const initProjectsList = () => {
    setLoading(true);
    if (loading || !hasMore) {
      return;
    }
    requestApi(listMyProjects, { limit, offset }, (myProject: { results: Project[]; count: number }, error: string) => {
      const { results, count } = myProject;
      setLoading(false);
      if (error) {
        return;
      }
      setProjects((previousProjects) => [...previousProjects, ...results]);
      if (myProject?.results?.length === 0) {
        setHasMore(false);
        return;
      } else {
        setOffset(offset + limit);
      }
    });
  };

  useEffect(() => {
    initProjectsList();
  }, []);

  return (
    <Tabs
      centered
      className="tabs"
      tabBarExtraContent={
        <Button size="large" type="primary" className="add-project-btn" icon={<PlusOutlined />} onClick={onAddProject}>
          {t(CREATE_PROJECT)}
        </Button>
      }
    >
      <Tabs.TabPane tab={t(PROJECTS)} key="1">
        <ProjectsList projects={projects} isMore={hasMore} initProjectsList={initProjectsList} />
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
      </Tabs.TabPane>
      <Tabs.TabPane tab={t(ACTIVITY)} key="2"></Tabs.TabPane>
    </Tabs>
  );
};

export const ProjectsPage: FunctionComponent = () => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { t } = useTranslation();
  const history = useHistory();
  const { isProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    isProfessionalCompleteProfile: boolean;
  };
  const { userState } = useMainContext();

  return (
    <Row justify="center" className="all-projects-container">
      <MetaTags title={`${t(MANZILIK)} | ${t(PROJECTS)}`} description={PROJECTS_SEO_DESCRIPTION} />

      <Col span={20}>
        {!isProfessionalCompleteProfile && userState?.isAuthenticated && userState?.client?.type === PROFESSIONAL ? (
          <InDismissibleAlert
            isBlocked
            onMessageClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
            actionBtnClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
          />
        ) : null}
        <ProfileHeader client={client!} />
        <TabsPanel />
      </Col>
    </Row>
  );
};

export default withUserAuthenticator(ProjectsPage);
