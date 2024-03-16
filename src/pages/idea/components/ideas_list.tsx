import React, { useState } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import { Idea } from '../../../API';
import { OTHER_PHOTO_IN, SEE_MORE_PHOTOS } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { ProjectIdeas } from '../types';

interface Props {
  ideas: Idea[];
  project: ProjectIdeas;
  onIdeaChange: Function;
  totalIdeas: number;
  defaultIdea: Idea;
}
export const IdeasList = ({ ideas, project, onIdeaChange, totalIdeas, defaultIdea }: Props) => {
  const { t } = useTranslation();
  // delete default idea from the list then add it to the beggining of the list
  const filteredIdeas = ideas
    ?.filter((idea) => idea?.id !== defaultIdea?.id)
    .concat(defaultIdea)
    .reverse();
  const [displayedIdeasCount, setDisplayedIdeasCount] = useState<number>(6);
  const [displayedIdeas, setDisplayedIdeas] = useState<Idea[]>(filteredIdeas.slice(0, 6));

  const onMoreIdeas = () => {
    const updatedDisplayedCount = displayedIdeasCount + 6;
    setDisplayedIdeas(filteredIdeas.slice(0, updatedDisplayedCount));
    setDisplayedIdeasCount(updatedDisplayedCount);
  };

  return (
    <>
      {displayedIdeas.length > 1 && (
        <p className="project-title">
          <Typography.Text>
            <span className="title-brief">{t(OTHER_PHOTO_IN)}</span>
            <span className="title">{project?.title}</span>
          </Typography.Text>
        </p>
      )}
      <Row gutter={20} justify="space-between">
        {displayedIdeas?.map((idea) => {
          return (
            <Col span={12} key={idea.id} className="idea-container">
              <img
                className="img-fit-content rounded-border img-item"
                src={idea?.photo!}
                alt={idea.title}
                onClick={() => onIdeaChange(idea)}
              />
            </Col>
          );
        })}
        {totalIdeas > displayedIdeasCount && (
          <div className="btn-container">
            <Button className="more-btn" onClick={onMoreIdeas}>
              {t(SEE_MORE_PHOTOS)}
            </Button>
          </div>
        )}
      </Row>
    </>
  );
};
