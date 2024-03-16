import React, { useEffect, useState, FunctionComponent, useContext } from 'react';
import { Tooltip, Col, Row, Divider } from 'antd';
import DropdownPopover from '../../../components/dropdown_popover';
import Separator from '../../../components/separator';
import { MORE_IDEAS_FROM_MANZEL, MY_IDEAS, ORGANIZE } from '../../../locales/strings';
import { ProjectOperations } from '../project_operations';
import { useMultiIdeasOperations } from '../../../app/providers/multi_idea_operations_provider';
import { MultiIdeasOperations } from '../../idea/idea_operations/multi_ideas_operations';
import { useClient } from '../../../app/hooks/use_client';
import { useTranslation } from 'react-i18next';
import icons from '../../../assets/icons';
import { ProjectFilters } from '../components/project_filters';
import { ProjectLayout } from '../components/project_layout';
import { UploadIdea } from '../upload_idea';
import { useParams } from 'react-router-dom';
import { UrlParams } from '../my_idea_list';
import { Project } from '../../../components/idea/types';
// icons
import ideaIcon from '../../../assets/icons/idea.svg';
import homeIcon from '../../../assets/icons/home.svg';
import { ProjectDetails } from '../project_details';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';

interface Props {
  isMyIdeasTab: boolean;
  onUploadIdeaToProject: Function;
  project: Project;
  onTabClick: Function;
  onFilterClick: Function;
  tag: string;
  setIsForceRefresh: Function;
}

const ToolBar: FunctionComponent<Props> = (props: Props) => {
  const { isMyIdeasTab, onUploadIdeaToProject, project, onTabClick, onFilterClick, tag, setIsForceRefresh } = props;
  const { showMultiIdeasOperations, hideMultiIdeasOperations } = useMultiIdeasOperations();
  const { t } = useTranslation();
  const [showPopOver, setShowPopOver] = useState<boolean>(true);
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;

  const isProjectOwner = client && client?.id === project?.client?.id;
  const isSettingDisabled = project?.ideas?.length === 0;
  const { id }: UrlParams = useParams();

  const onSettingsIconClick = () => {
    showMultiIdeasOperations(
      <MultiIdeasOperations
        cancelOrganizeMode={() => {
          hideMultiIdeasOperations();
        }}
        projectId={project?.id!}
      />
    );
    setShowPopOver(false);
  };

  const settingsContent = (
    <div className={`popover-item ${isSettingDisabled ? 'popover-item-disabled' : ''}`} onClick={onSettingsIconClick}>
      <img src={icons.edit.icon} />
      {t(ORGANIZE)}
    </div>
  );

  useEffect(() => {
    setShowPopOver(true);
  }, [!showPopOver]);

  return (
    <>
      <Row justify="space-between" align="middle" className="project-details-operations">
        <ProjectDetails projectDetails={project!} />
        <Col xl={8} lg={8} md={12} sm={24} xs={24}>
          <Row className="operations" align="top">
            <ProjectOperations project={project} />
            {isProjectOwner && isMyIdeasTab && (
              <>
                <Separator horizontal={15} />
                <DropdownPopover
                  content={settingsContent}
                  disabled={isSettingDisabled}
                  trigger="click"
                  showPopOver={showPopOver}
                >
                  <Tooltip placement="top" title={t(ORGANIZE)}>
                    <img src={icons.settings.icon} />
                  </Tooltip>
                </DropdownPopover>
              </>
            )}
          </Row>
        </Col>
      </Row>

      <Divider type="horizontal" />
      <Row align="middle" justify="space-between">
        {isMyIdeasTab ? <ProjectFilters onFilterClick={onFilterClick} tag={tag} /> : <div />}
        <Row align="middle">
          <Row className="tabs">
            <div className={`tab ${isMyIdeasTab ? 'tab-active' : ''}`} onClick={() => onTabClick('myIdeas')}>
              <img src={ideaIcon} />
              {t(MY_IDEAS)}
            </div>
            <div className={`tab ${isMyIdeasTab ? '' : 'tab-active'}`} onClick={() => onTabClick('moreIdeas')}>
              <img src={homeIcon} />
              {t(MORE_IDEAS_FROM_MANZEL)}
            </div>
          </Row>
          <Separator horizontal={12} />
          <Row justify={window.innerWidth > 600 ? 'end' : 'start'}>
            {isProjectOwner && isMyIdeasTab && (
              <>
                <UploadIdea
                  projectId={id!}
                  onUploadIdeaToProject={onUploadIdeaToProject}
                  setIsForceRefresh={setIsForceRefresh}
                />
                <Separator horizontal={5} />
              </>
            )}
            <ProjectLayout />
          </Row>
        </Row>
      </Row>
    </>
  );
};

export default ToolBar;
