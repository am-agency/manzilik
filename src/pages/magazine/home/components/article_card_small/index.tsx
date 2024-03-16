import React from 'react';
import { Button, Col } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Magazine } from '../../../../../API';
import { getCategoryTitleBasedOnLanguage, replaceSpaceWithDash } from '../../../../../utils';
import { toArrayOrEmpty } from '../../../../idea/utils';
import { MAGAZINES_ROUTE } from '../../../../../utils/routes';
import { getArticlePath } from '../../../utils';

interface Props {
  magazine?: Magazine;
  withVideo?: boolean;
}

const ArticleCardSmall = (props: Props) => {
  const { magazine, withVideo } = props;
  const history = useHistory();
  const category = toArrayOrEmpty(magazine?.categories)[0];
  const categoryTitle = getCategoryTitleBasedOnLanguage(category);

  return (
    <Col lg={8} md={8} sm={12} xs={12}>
      <div className="article-card-small">
        <div className="article-card-img">
          <img src={magazine?.photo} alt={magazine?.title!} className="clickable img-fit-content rounded-top-border" />
          {withVideo && (
            <Button className="watch-now-btn" type="ghost">
              Watch now
            </Button>
          )}
        </div>
        <div className="description">
          <Link to={`${MAGAZINES_ROUTE}/${category?.id}`}>
            <div className="article-category link clickable">{categoryTitle}</div>
          </Link>
          <Link to={getArticlePath(magazine!)}>
            <div className="article-title clickable">{magazine?.title}</div>
          </Link>
        </div>
      </div>
    </Col>
  );
};

export default ArticleCardSmall;
