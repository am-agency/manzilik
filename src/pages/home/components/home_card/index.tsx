import React, { FunctionComponent, useState } from 'react';
import { Magazine } from '../../../../API';
import { Idea, TV, Project } from '../../../../components/idea/types';
import { TVCard } from '../../../magazine/tv_list/components/tv_card';
import { PROFESSIONALS_ROUTE } from '../../../../utils/routes';
import { replaceSpace } from '../../../ideas/utils';
import { IdeaCard } from '../../../idea/components/idea_card';
import { HomeRoomType, HomeService } from '../../types';
import i18n from '../../../../app/i18n';
import { AR } from '../../../../locales/constants';
import { Link } from 'react-router-dom';
import icons from '../../../../assets/icons';
import { Row } from 'antd';
import Separator from '../../../../components/separator';
import { MagazineCard } from '../../../magazine/home/components/magazine_card';

interface CategoryProps {
  roomType: HomeRoomType;
}

interface ServiceProps {
  service: HomeService;
}

interface TvProps {
  tv: TV;
}

interface MagazineProps {
  magazine: Magazine;
  i: number;
}

interface IdeaProps {
  idea: Idea;
  project: Project;
}

export const CategoryCard: FunctionComponent<CategoryProps> = ({ roomType }: CategoryProps) => {
  const title = i18n.language == AR ? roomType?.title : roomType?.english_title;
  const searchPath = `/ideas/?q=&c=${replaceSpace(title)}&f=&o=0`;

  return (
    <Link to={searchPath}>
      <div className="home-card clickable">
        <div className="card-img-container">
          <img
            className="img-fit-content rounded-border"
            src={roomType?.photo! || roomType.category?.photo!}
            alt={roomType?.title}
          />
        </div>
        <div className="card-content">
          <h5 className="title">{title} </h5>
        </div>
      </div>
    </Link>
  );
};

export const ServiceCard: FunctionComponent<ServiceProps> = ({ service }: ServiceProps) => {
  const title = i18n.language == AR ? service?.title : service?.english_title;
  const professionalPath = `${PROFESSIONALS_ROUTE}/?q=&c=&services=${replaceSpace(title)}&f=&o=0&l=10`;
  const isEnglish = i18n.language !== AR;
  const [isCardHover, setIsCardHover] = useState<boolean>(false);

  const onCardHover = () => {
    setIsCardHover(true);
  };

  const onMouseLeave = () => {
    setIsCardHover(false);
  };

  return (
    <Link to={professionalPath}>
      <div className="home-card clickable service-card" onMouseOver={onCardHover} onMouseLeave={onMouseLeave}>
        <Row justify="center" align="middle" className="card-content">
          <span className={isEnglish ? 'icon-wrapper' : ''}>
            <img src={!isCardHover ? icons.serviceArrow : icons.serviceArrowFill} />
          </span>
          <Separator horizontal={5} />
          <h5 className="title">{title}</h5>
        </Row>
      </div>
    </Link>
  );
};

export const HomeTVCard: FunctionComponent<TvProps> = ({ tv }: TvProps) => {
  return <TVCard tv={tv} />;
};

export const HomeMagazineCard: FunctionComponent<MagazineProps> = ({ magazine, i }: MagazineProps) => {
  return <MagazineCard key={i} magazine={magazine} withCategory />;
};

export const HomeIdeaCard: FunctionComponent<IdeaProps> = ({ idea, project }: IdeaProps) => {
  return (
    <div className="idea-list-container">
      <IdeaCard idea={idea} project={project} />
    </div>
  );
};
