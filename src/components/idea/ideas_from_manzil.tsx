import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import icons from '../../assets/icons';
import { getLayoutDirection } from '../../app/layouts';
import { useHistory } from 'react-router';
import { BaseEntity, Project } from './types';
import { getIdeaCardDirection } from './utils';
import { Link } from 'react-router-dom';
import { IDEAS } from '../../app/settings';
import { modifyImageUrl } from '../../utils';

interface Props {
  onCardHover: () => void;
  onAddIdeaToProject: Function;
  entity: BaseEntity;
  isIdeaSelected: boolean;
  project?: Project;
}

export const IdeasFromManzil: React.FunctionComponent<Props> = ({
  onCardHover,
  entity,
  onAddIdeaToProject,
  isIdeaSelected,
  project,
}: Props) => {
  const { i18n } = useTranslation();
  const history = useHistory();

  return (
    <div onMouseLeave={onCardHover} className="idea-hover">
      <div>
        <Card
          hoverable
          cover={
            <div className="image-container">
              <Link to={getIdeaCardDirection(entity!, project!, IDEAS)}>
                <img
                  src={modifyImageUrl(entity?.photo!, 248)}
                  alt={entity?.title!}
                  className="rounded-border img-fit-content"
                />
              </Link>
              <img
                className={`save-icon ${getLayoutDirection(i18n.language)}`}
                src={isIdeaSelected ? icons.saved.icon : icons.save.icon}
                onClick={() => onAddIdeaToProject(entity)}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};
