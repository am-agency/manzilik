import React, { FunctionComponent } from 'react';
// Components
import { Row } from 'antd';
import { ProjectCard } from '../project_card';
import { Project } from '../../../API';
import InfiniteScroll from 'react-infinite-scroller';
import { LOADING } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface Props {
  projects: Project[];
  isMore: boolean;
  initProjectsList: () => void;
}

export const ProjectsList: FunctionComponent<Props> = ({ projects, isMore, initProjectsList }: Props) => {
  const { t } = useTranslation();
  return (
    <InfiniteScroll
      initialLoad={false}
      useWindow={true}
      className="projects-list-container"
      loadMore={initProjectsList}
      hasMore={isMore}
      loader={<span>{t(LOADING)}</span>}
    >
      <Row justify="start">
        {projects?.map((project, index) => {
          return <ProjectCard project={project!} key={index} />;
        })}
      </Row>
    </InfiniteScroll>
  );
};
