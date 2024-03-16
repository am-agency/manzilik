import React, { FunctionComponent } from 'react';
import { List } from 'antd';

import { Client, Comment } from '../../../API';

import { useTranslation } from 'react-i18next';

import { NO_COMMENTS } from '../../../locales/strings';

import SingleComment from '../comment';
import { AnalyticsLikeEventParams } from '../../../analytics';

interface Props {
  comments: Comment[];
  client: Client;
  resourceId?: string;
  withExtraActions: boolean;
  postDeleteComment: Function;
  analyticsItemType: AnalyticsLikeEventParams['item_type'];
}

const CommentsList: FunctionComponent<Props> = (props: Props) => {
  const { resourceId, comments, client, withExtraActions, postDeleteComment } = props;
  const { i18n, t } = useTranslation();

  return (
    <List
      dataSource={comments}
      bordered={false}
      split={false}
      loadMore={false}
      size="small"
      itemLayout="vertical"
      locale={{ emptyText: t(NO_COMMENTS) }}
      renderItem={(comment: Comment, index: number) => {
        return (
          <List.Item key={comment.id} className="comment">
            <SingleComment
              index={index}
              comment={comment}
              client={client!}
              resourceId={resourceId}
              withExtraActions={withExtraActions}
              postDeleteComment={postDeleteComment}
              analyticsItemType={props.analyticsItemType}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default CommentsList;
