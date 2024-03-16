import React, { FunctionComponent, useEffect, useState } from 'react';
// hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMainContext } from '../../../../app/providers/main';
// types
import { Icon } from '../../../idea/types';
import { Client, Discussion as DiscussionFromAPI } from '../../../../API';
// strings
import { POSTED_BY, SEND, UPDATED_AT } from '../../../../locales/strings';
import { DISCUSSION_ROUTE, LOGIN_ROUTE } from '../../../../utils/routes';
// utils
import { getLikesNumber, getUserName, replaceSpaceWithDash } from '../../../../utils';
import { getTimeFormatBasedOnLanguage, toArrayOrEmpty } from '../../../idea/utils';
import { getLayoutDirection } from '../../../../app/layouts';
// components
import { TagsList } from '../../../../components/tags_list';
import { UsersIcon } from '../users_icons_list';
import { Card, Row, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { ideaIcons } from '../../../../assets/icons/idea';
import { likeEntity } from '../../../../app/providers/api';
import { ModalTitle } from '../../../../components/modal_title';
import { useModal } from '../../../../app/providers/modal';
import * as analytics from '../../../../analytics';

export interface Discussion extends DiscussionFromAPI {
  is_liked: boolean;
  likes_count: number;
  who_like: Client[];
  comments: Comment[];
  client: Client;
  latest_two_commenters: Client[] | null;
}
interface DiscussionCardProps {
  discussion: Discussion | null;
}

export const DiscussionCard: FunctionComponent<DiscussionCardProps> = (props: DiscussionCardProps) => {
  const { discussion } = props;

  const [isLiked, setIsLiked] = useState<boolean>(discussion?.is_liked!);
  const [likesCount, setLikesCount] = useState<number | null | undefined>(discussion?.likes_count || 0);
  const { userState, requestApi } = useMainContext();
  const discussionPath = DISCUSSION_ROUTE + `/${replaceSpaceWithDash(discussion?.title!)}/${discussion?.id}`;
  const { showModal } = useModal();

  const history = useHistory();
  const { i18n, t } = useTranslation();

  const getIcon = (icon: Icon, isFilled?: boolean) => {
    return isFilled ? icon.filledIcon : icon.icon;
  };

  useEffect(() => {
    setIsLiked(discussion?.is_liked!);
  }, [discussion?.is_liked, discussion?.id]);

  const onLikeDiscussion = () => {
    if (userState.isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(getLikesNumber(likesCount!, !isLiked));
      requestApi(likeEntity, { resourceId: discussion?.id }, (result: string, error: string) => {});
      analytics.PublishEvent(new analytics.AnalyticsLikeEvent(analytics.ItemType.Discussion_topic, discussion?.id!));
    } else {
      showModal(<ModalTitle />, <div />, '', SEND);
    }
  };

  const onCommentClick = () => {
    history.push(`${discussionPath}#comments`);
  };

  return (
    <Card
      bordered
      className={`discussion-card ${getLayoutDirection(i18n.language)}`}
      actions={[
        <div key={ideaIcons.like.title} onClick={onLikeDiscussion}>
          <img src={getIcon(ideaIcons.like, isLiked)} />
          <span className="number-text">{likesCount}</span>
          &nbsp;&nbsp;&nbsp;
        </div>,
        <div key={ideaIcons.comment.title} onClick={onCommentClick}>
          <img src={getIcon(ideaIcons.comment)} />
          <span className="number-text">{discussion?.comments_count}</span>
          &nbsp;&nbsp;&nbsp;
        </div>,
      ]}
    >
      <Meta
        title={
          <div onClick={() => history.push(discussionPath)}>
            {discussion?.title!.length! > 100 ? <>{discussion?.title?.slice(0, 100)}...</> : discussion?.title}
          </div>
        }
        description={
          <Row justify="space-between">
            <div className="discussion-details-left-side">
              <Typography.Text className="by-text">{t(POSTED_BY)} </Typography.Text>
              &nbsp;&nbsp;
              <Typography.Text className="client-name-text">{getUserName(discussion?.client)}</Typography.Text>
              <Typography.Text className="created-at-text">
                &nbsp;&nbsp; . &nbsp;&nbsp;
                {getTimeFormatBasedOnLanguage(discussion?.created_at!)}
              </Typography.Text>
              &nbsp;&nbsp;
              <TagsList
                tags={discussion?.topics?.map((tp) => tp?.title!)}
                onTagSelect={(index: number) => {
                  history.push('/discussions/' + toArrayOrEmpty(discussion?.topics)[index].id);
                }}
              />
            </div>
            <div className="discussion-details-right-side">
              {discussion?.comments_count! > 0 && (
                <Typography.Text className="updated-at-text">
                  {t(UPDATED_AT)}&nbsp;{getTimeFormatBasedOnLanguage(discussion?.updated_at!)}
                </Typography.Text>
              )}
              <UsersIcon discussion={discussion} />
            </div>
          </Row>
        }
      />
    </Card>
  );
};
