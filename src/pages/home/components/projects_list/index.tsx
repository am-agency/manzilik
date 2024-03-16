import React, { FunctionComponent } from 'react';
import { Row } from 'antd';
import { withPagination, WithPaginationProps } from '../../../../app/hooks/with_pagination';
import { IdeaCardWrapper } from '../wrappers';
import { IdeaCard } from '../../../idea/components/idea_card';
import { listHomePageProjects } from '../../api';
import { useMainContext } from '../../../../app/providers/main';
import CardsGridSkeleton from '../../../../components/skeletons/cards_grid_skeleton';
import { LOADING_PROJECTS_HOME_LIST } from '../../../../app/providers/main/loading_constants';

interface ListFeeds {
  data: string;
}
const ProjectsList: FunctionComponent<WithPaginationProps<ListFeeds>> = (props: WithPaginationProps<ListFeeds>) => {
  const { list } = props;
  const { loadingMap } = useMainContext();
  return (
    <>
      <Row justify="center" align="middle" className="ideas">
        {list
          ?.map((json) => JSON.parse(json.data))
          .map((project) => {
            return (
              <IdeaCardWrapper key={project.id}>
                <IdeaCard idea={project?.default_idea! || (project.ideas && project.ideas[0])} />
              </IdeaCardWrapper>
            );
          })}
      </Row>
      {loadingMap[LOADING_PROJECTS_HOME_LIST] && <CardsGridSkeleton cols={2} cardsCount={4} />}
    </>
  );
};

const ProjectsListWithPagination = withPagination<ListFeeds>(
  listHomePageProjects, // api function
  ProjectsList, // component
  false, // manual load
  LOADING_PROJECTS_HOME_LIST
);

export default ProjectsListWithPagination;
