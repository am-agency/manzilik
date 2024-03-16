import React from 'react';
import { Row, Col, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Category, Magazine } from '../../../../../API';
import { getLayoutDirection } from '../../../../../app/layouts';
import { ideaIcons } from '../../../../../assets/icons/idea';
import Separator from '../../../../../components/separator';
import { BY, FULL_STORY } from '../../../../../locales/strings';
import {
  getCategoryTitleBasedOnLanguage,
  getClientProfile,
  getUserName,
  replaceSpaceWithDash,
} from '../../../../../utils';
import { toArrayOrEmpty } from '../../../../idea/utils';
import { GENERIC_MAGAZINE_ROUTE, MAGAZINES_ROUTE } from '../../../../../utils/routes';
import { COMMENTS_TEXT } from '../../../../../app/settings';

interface Props {
  withTag?: boolean;
  tag?: string;
  magazine?: Magazine;
}

export const ArticleCard = (props: Props) => {
  const { withTag, tag, magazine } = props;
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const category: Category = toArrayOrEmpty(magazine?.categories)[0];
  const categoryTitle = getCategoryTitleBasedOnLanguage(category!);

  const onCardClick = () => {
    history.push(`${GENERIC_MAGAZINE_ROUTE}/${replaceSpaceWithDash(magazine?.title!)}/${magazine?.id}`);
  };

  const onCardTagClick = () => {
    history.push(`${MAGAZINES_ROUTE}/${category.id}`);
  };

  return (
    <div className={`article-card ${withTag ? 'with-tag' : ''}`}>
      <img
        alt={magazine?.title!}
        src={magazine?.photo}
        onClick={onCardClick}
        className="clickable article-card-img img-fit-content rounded-top-border"
      />
      {withTag && (
        <Tag onClick={onCardTagClick} className={`card-tag clickable ${getLayoutDirection(i18n.language)}`}>
          {categoryTitle}
        </Tag>
      )}
      <div className="description">
        {!withTag && (
          <div
            className="article-category link clickable"
            onClick={() => {
              history.push(`/magazines/${category?.id}`);
            }}
          >
            {categoryTitle!}
          </div>
        )}
        <Typography.Paragraph className="article-title clickable" ellipsis={{ rows: 1 }} onClick={onCardClick}>
          {magazine?.title || ' '}
        </Typography.Paragraph>
        <Row justify="space-between">
          <div className="client-name-text clickable" onClick={() => getClientProfile(history, magazine?.client!)}>
            <span className="by-text">{t(BY)} </span>
            {getUserName(magazine?.client)}
          </div>
          {withTag && (
            <span
              className="comment-icon icon clickable"
              onClick={() => {
                history.push(
                  `${GENERIC_MAGAZINE_ROUTE}/${replaceSpaceWithDash(magazine?.title!)}/${magazine?.id}#${COMMENTS_TEXT}`
                );
              }}
            >
              <img src={ideaIcons.comment.icon} />
              <Separator horizontal={2} />
              <span className="comments-number">{magazine?.comments_count}</span>
            </span>
          )}
        </Row>
        {!withTag && (
          <div className="article-brief-wrapper">
            <Typography.Text className="article-brief" ellipsis>
              {magazine?.meta_description}
            </Typography.Text>
          </div>
        )}
        {!withTag && (
          <Row justify="space-between">
            <div className="link clickable" onClick={onCardClick}>
              {t(FULL_STORY)}
            </div>
            <span className="comment-icon icon" onClick={onCardClick}>
              <img src={ideaIcons.comment.icon} />
              <Separator horizontal={2} />
              <span className="comments-number">{magazine?.comments_count}</span>
            </span>
          </Row>
        )}
      </div>
    </div>
  );
};
