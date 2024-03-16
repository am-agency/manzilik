import React, { FunctionComponent } from 'react';
import { Avatar, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Project } from '../../../API';
import { IDEA } from '../../../locales/strings';

interface ProjectItemProps {
  project: Project;
}

export const ProjectItem: FunctionComponent<ProjectItemProps> = (props: ProjectItemProps) => {
  const { project } = props;
  const idea = project?.default_idea;
  const { t } = useTranslation();
  return (
    <Row align="middle" className="select-project-list-item">
      <Avatar shape="square" icon={idea?.photo ? <img alt={`${idea?.title}`} src={idea?.photo!} /> : null} size={45} />
      <div>
        <Row>
          <span className="project-name-text">{project?.title}</span>
        </Row>
        <Row>
          <span className="items-number-text">{`${t(IDEA, {
            count: project?.ideas_count!,
          })}`}</span>
        </Row>
      </div>
    </Row>
  );
};
