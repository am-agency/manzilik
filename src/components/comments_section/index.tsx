import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Row, Select, Avatar, Col, Button, message } from 'antd';

import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../app/providers/main';

import { Client, Comment } from '../../API';
import { addComment } from './api';

import {
  COMMENTS,
  SORTED_BY,
  OLDEST,
  LATEST,
  WRITE_COMMENT,
  SEE_MORE_COMMENTS,
  CANCEL,
  SEND,
  COMMENT_IS_EMPTY,
  SEND_BY_EMAIL,
} from '../../locales/strings';

import CommentsList from './comments_list';
import Editor from '../../pages/discussions/start_discussion/quill_editor';
import Separator from '../separator';

import { getLayoutDirection } from '../../app/layouts';

import { useHistory } from 'react-router';
import { LOGIN_ROUTE } from '../../utils/routes';
import { listComments } from './api';
import { listLimit } from '../../app/settings';
import { toArrayOrEmpty } from '../../pages/idea/utils';
import { isCommentEmpty } from './utils';
import { ModalTitle } from '../modal_title';
import icons from '../../assets/icons';
import SendMessageForm from '../send_message_form';
import { useModal } from '../../app/providers/modal';
import { GuestUserModal } from '../guest_user_modal';
import * as analytics from '../../analytics';

interface Props {
  client?: Client;
  resourceId?: string;
  withExtraActions?: boolean;
  onShowTotalNumber?: Function;
  onAddComment?: () => boolean;
  analyticsItemType: analytics.AnalyticsLikeEventParams['item_type'];
}

const CommentsSection = (props: Props) => {
  const { client, resourceId, withExtraActions = true, onShowTotalNumber } = props;
  const [writeComment, toggleWriteComment] = useState(false);
  const [comment, updateComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const { userState, requestApi } = useMainContext();
  const { showModal } = useModal();
  const { t, i18n } = useTranslation();

  const onAddComment = () => {
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
      return;
    }
    if (isCommentEmpty(comment)) {
      message.error(t(COMMENT_IS_EMPTY));
      return;
    }
    requestApi(addComment, { content: comment, resourceId }, (addedComment: Comment, error: string) => {
      if (error) {
        return;
      } else {
        analytics.PublishEvent(new analytics.AnalyticsSubmitCommentEvent(comment, resourceId!));
        setComments([...comments, addedComment]);
        setTotalComments(totalComments + 1);
        toggleWriteComment(false);
        updateComment('');
      }
    });
  };

  const postDeleteComment = (newCommentsCount: number) => {
    setTotalComments(totalComments - 1);
  };

  const onShowMoreComments = () => {
    getCommentsList();
  };

  const getCommentsList = (refresh: boolean = false) => {
    const currentOffset = refresh ? 0 : offset;
    requestApi(
      listComments,
      { input: { resourceId, offset: currentOffset, limit: listLimit }, user: userState.isAuthenticated },
      (response: { comments: Comment[]; comments_total: number }, error: string) => {
        if (error) {
          return;
        }
        const { comments_total } = response;
        if (refresh) {
          setComments([...toArrayOrEmpty(response.comments)]);
        } else {
          setComments([...toArrayOrEmpty(response.comments), ...toArrayOrEmpty(comments)]);
        }
        setTotalComments(comments_total);
        setOffset(currentOffset + listLimit);
      }
    );
  };

  useEffect(() => {
    onShowTotalNumber?.(totalComments);
  }, [totalComments]);

  useEffect(() => {
    resourceId && getCommentsList(true);
  }, [resourceId]);

  return (
    <div className="comments-section" id="comments">
      <Separator vertical={5} />
      {withExtraActions && (
        <>
          <Row justify="space-between" className="list-header">
            <Row justify="center" align="middle">
              {t(COMMENTS)}
              <div className="comments-count">{totalComments}</div>
            </Row>
            {/* @TODO: will be enabled when it's done from backend
             <span>
              {t(SORTED_BY)}
              <Select
                defaultValue={1}
                value={1}
                dropdownClassName={`sort-comment-filter ${getLayoutDirection(i18n.language)}`}
              >
                <Select.Option value={1}>{t(OLDEST)}</Select.Option>
                <Select.Option value={2}>{t(LATEST)}</Select.Option>
              </Select>
            </span> */}
          </Row>
          <Separator vertical={25} />
        </>
      )}
      {totalComments! - comments.length > 0 && (
        <>
          <Row className="more-comments-btn clickable" onClick={onShowMoreComments}>
            {t(SEE_MORE_COMMENTS, { number: totalComments! - comments.length })}
          </Row>
          <Separator vertical={30} />
        </>
      )}
      <CommentsList
        comments={comments}
        client={client!}
        resourceId={resourceId}
        withExtraActions={withExtraActions}
        postDeleteComment={postDeleteComment}
        analyticsItemType={props.analyticsItemType}
      />
      <Separator vertical={10} />
      <Row>
        <Avatar src={client?.profile_image} icon={<UserOutlined />} />
        <Separator horizontal={8} />
        <Col flex={1} id="write-comment">
          {writeComment ? (
            <>
              <div className={`editor-wrapper ${getLayoutDirection(i18n.language)}`}>
                <Editor withPoll={false} updateEditorValue={updateComment} />
              </div>
              <Separator vertical={5} />
              <Row justify="end">
                <Button
                  type="ghost"
                  onClick={() => {
                    toggleWriteComment(false);
                    updateComment('');
                  }}
                >
                  {t(CANCEL)}
                </Button>
                <Separator horizontal={5} />
                <Button type="primary" onClick={onAddComment}>
                  {t(SEND)}
                </Button>
                <Separator horizontal={5} />
              </Row>
            </>
          ) : (
            <div
              className="write-comment"
              onClick={() => {
                if (!props.onAddComment || props.onAddComment()) {
                  toggleWriteComment(true);
                }
              }}
            >
              {t(WRITE_COMMENT)}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CommentsSection;
