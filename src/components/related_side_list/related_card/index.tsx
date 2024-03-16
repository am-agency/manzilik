import { List, Row, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { RelatedSideListType } from '../../../app/settings';
import { ideaIcons } from '../../../assets/icons/idea';
import { FULL_STORY } from '../../../locales/strings';
import Separator from '../../separator';
import defaultPic from '../../../assets/backgrounds/empty_discussion.svg';
import { Discussion } from '../../idea/types';
import { checkValidImageUrl, replaceSpaceWithDash } from '../../../utils';

interface Props {
  action: string;
  item: Discussion;
  baseRedirectUrl?: string;
}

export const RelatedCard: FunctionComponent<Props> = (props: Props) => {
  const { action, item, baseRedirectUrl } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const cardPath = `${baseRedirectUrl}${replaceSpaceWithDash(item.title!)}/${item?.id}`;
  //@todo this solution was made due to the fact that the backend returned "null" as string to the item.photo prop.
  //@todo check whether this image has one source that we can rely on instead of the two that were checked before .
  const validImage = [item.photo!, item.photo_url!].find(checkValidImageUrl) ?? defaultPic;
  return (
    <List.Item>
      <Row>
        <img
          onClick={() => {
            history.push(cardPath);
          }}
          className="clickable side-col-img rounded-border img-fit-content"
          src={validImage}
          alt={item?.title!}
        />
      </Row>
      <div className="list-item-body">
        <p
          className="clickable"
          onClick={() => {
            history.push(cardPath);
          }}
        >
          {item?.title!.length > 40 ? (
            <Typography.Paragraph ellipsis={{ rows: 4 }}>{item?.title?.slice(0, 40)}...</Typography.Paragraph>
          ) : (
            <Typography.Paragraph ellipsis={{ rows: 4 }}>{item?.title}</Typography.Paragraph>
          )}
        </p>

        {action === RelatedSideListType.withComment ? (
          <span className="icon-wrapper">
            <img src={ideaIcons.comment.icon} />
            <Separator horizontal={2} />
            {item.comments_count}
          </span>
        ) : (
          <Link to={cardPath} className="ref-link">
            {t(FULL_STORY)}
          </Link>
        )}
      </div>
    </List.Item>
  );
};
