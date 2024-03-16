import { Card, CardProps, Col } from 'antd';
import React from 'react';
import { Project } from '../../../API';
import { Status } from '../types';
import { useHistory } from 'react-router-dom';
import { getIdeaLink } from '../../../utils';

interface Props {
  project: Project;
}

export const ProjectPreviewCard = (props: CardProps & Props) => {
  const { project } = props;
  const history = useHistory();

  if (project.status === Status.DELETED) {
    return null;
  }

  const idea = project?.default_idea;

  return (
    <Col xl={8} lg={8} md={12} xs={24} sm={24}>
      <div className="project-card preview">
        <Card
          bordered
          onClick={() => history.push(getIdeaLink(project?.default_idea!, project))}
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
          <span className="project-name">{project.title}</span>
        </Card>
      </div>
    </Col>
  );
};
