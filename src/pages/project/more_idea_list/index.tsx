import { Row, Col, message } from 'antd';
import React, { useState, FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { withPagination, WithPaginationProps } from '../../../app/hooks/with_pagination';
import { useMainContext } from '../../../app/providers/main';
import { IdeaDestination } from '../../../app/settings';
import { IdeaCard } from '../../../components/idea';
import { BaseEntity, Project } from '../../../components/idea/types';
import { getMoreIdeas, saveEntityToProject } from '../api';
import { SuccessMessage } from '../components/success_msg';
import { UrlParams } from '../my_idea_list';

const messageProps = (project: Project) => ({
  content: <SuccessMessage project={project!} />,
  className: 'success-message',
  top: 250,
});

interface Props {
  project?: Project;
  setMoreIdeasIsAdded?: Function; // this is to inform the component new ideas from more ideas is added
}

const MoreIdeasList: FunctionComponent<WithPaginationProps<BaseEntity> & Props> = (
  props: WithPaginationProps<BaseEntity> & Props
) => {
  const { setMoreIdeasIsAdded, project, list } = props;
  const [addedIdeasIds, setAddedIdeasIds] = useState<string[]>([]);

  const { requestApi } = useMainContext();
  const { id }: UrlParams = useParams();

  const onAddIdeaToProject = (idea: BaseEntity) => {
    requestApi(saveEntityToProject, { project_id: id, id: idea.id }, (res: { message: string }, error: string) => {
      if (error) {
        return;
      }
      setAddedIdeasIds([...addedIdeasIds, idea.id!]);
      setMoreIdeasIsAdded?.(true);
      message.success(messageProps(project!));
    });
  };

  return (
    <Row gutter={20} justify="start" align="middle" className="ideas">
      {list?.map((idea) => {
        return (
          <Col xl={6} lg={6} md={8} sm={24} xs={24} key={idea.id}>
            <IdeaCard
              project={project}
              entity={idea}
              ideaDestination={IdeaDestination.IdeasFromManzil}
              onAddIdeaToProject={onAddIdeaToProject}
              isIdeaSelected={addedIdeasIds.includes(idea.id!)}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default withPagination<BaseEntity, Props>(getMoreIdeas, MoreIdeasList);
