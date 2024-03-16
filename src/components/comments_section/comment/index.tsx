import React, { FunctionComponent, useState } from 'react';
import { Button, Col, Divider, Row } from 'antd';

import { Client, Comment } from '../../../API';
import { useMainContext } from '../../../app/providers/main';

import { ARE_YOU_SURE_DELETE_COMMENT_MSG, CANCEL, NO, REPORT_SPAM, SEND, SUBMIT, YES } from '../../../locales/strings';

import icons from '../../../assets/icons';

import discussionsIcons from '../../../assets/icons/discussions';
import { ideaIcons } from '../../../assets/icons/idea';
import { useHistory } from 'react-router';
import { PopConfirm } from '../../pop_confirm';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../app/providers/modal';
import { SpamList } from './spam_list';
import Separator from '../../separator';
import i18n from '../../../app/i18n';
import { getLayoutDirection } from '../../../app/layouts';
import Editor from '../../../pages/discussions/start_discussion/quill_editor';
import { getClientProfile, getLikesNumber, getUserName } from '../../../utils';
import Avatar from '../../avatar';
import { getTimeFormatBasedOnLanguage } from '../../../pages/idea/utils';
import { likeEntity } from '../../../app/providers/api';
import { deleteComment, updateComment } from '../api';
import { ModalTitle } from '../../modal_title';
import { ClientBadgesAndRewords } from '../../../pages/clients_landing_page/components/client-padges-and-rewords';
import * as analytics from '../../../analytics';

interface Props {
  comment: Comment;
  client: Client;
  postDeleteComment?: Function;
  resourceId?: string;
  index: number;
  withExtraActions: boolean;
  analyticsItemType: analytics.AnalyticsLikeEventParams['item_type'];
}

const SingleComment: FunctionComponent<Props> = (props: Props) => {
  const { postDeleteComment, resourceId, comment, client, index, withExtraActions } = props;

  const { requestApi, userState } = useMainContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { showModal } = useModal();

  const [isCommentLiked, setIsCommentLiked] = useState<boolean>(comment?.is_liked!);
  const [newComment, setNewComment] = useState<string | undefined | null>(comment?.content);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCommentDeleted, setIsCommentDeleted] = useState<boolean>(false);
  const isOwner = client?.id == comment?.client?.id;
  const [likesCount, setLikesCount] = useState<number>(comment?.likes_count!);

  const onUpdateComment = (comment: Comment) => {
    requestApi(
      updateComment,
      { id: comment.id, resourceId, content: newComment },
      (response: Comment, error: string) => {
        if (error) {
          return;
        }
        setNewComment(response.content);
        setIsEditMode(false);
      }
    );
  };

  const onAddLikeToComment = () => {
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
    } else {
      requestApi(likeEntity, { resourceId: comment.id }, (response: { status: string }, error: string) => {
        if (error) {
          return;
        }
        const like = response.status === 'CREATED' ? true : false;
        setIsCommentLiked(like);
        const numbers = getLikesNumber(likesCount, like);
        setLikesCount(numbers);
        analytics.PublishEvent(new analytics.AnalyticsLikeEvent(props.analyticsItemType, comment.id));
      });
    }
  };

  const onSpamComment = () => {
    showModal(t(REPORT_SPAM), <SpamList entityId={comment.id} />, 'modal-wrapper', t(SUBMIT));
  };

  const onDeleteComment = () => {
    requestApi(deleteComment, { id: comment.id, resourceId }, (response: Comment, error: string) => {
      if (error) {
        return;
      }
      setIsCommentDeleted(true);
      postDeleteComment?.();
    });
  };

  if (isCommentDeleted) {
    return <div />;
  }

  return (
    <>
      <>
        {index > 0 && <Divider />}
        <Row>
          <div onClick={() => getClientProfile(history, comment?.client!)}>
            <Avatar src={comment?.client?.profile_image} size={35} />
          </div>
          <Separator horizontal={9} vertical={0} />

          <div>
            <p className="commenter-name-text clickable" onClick={() => getClientProfile(history, comment?.client!)}>
              {getUserName(comment.client)}
              <br />
              <ClientBadgesAndRewords client={client} isSmallBadge />
              <span>
                <p className="comment-createdAt-text">{getTimeFormatBasedOnLanguage(comment.created_at!)}</p>
              </span>
            </p>
          </div>
        </Row>
        {isEditMode ? (
          <>
            <div className={`editor-wrapper ${getLayoutDirection(i18n.language)}`}>
              <Editor withPoll={false} editorDefaultValue={comment.content!} updateEditorValue={setNewComment} />
            </div>
            <Separator vertical={5} />
            <Row justify="end">
              <Button
                type="ghost"
                onClick={() => {
                  setIsEditMode(false);
                }}
              >
                {t(CANCEL)}
              </Button>
              <Separator horizontal={5} />
              <Button type="primary" onClick={() => onUpdateComment(comment)}>
                {t(SEND)}
              </Button>
              <Separator horizontal={5} />
            </Row>
          </>
        ) : (
          <>
            <div className="comment-content" dangerouslySetInnerHTML={{ __html: newComment! }}></div>
            <Row className="icon">
              <Row justify="center" align="middle">
                <img
                  className="clickable"
                  src={!isCommentLiked ? ideaIcons.like.icon : icons.love.icon}
                  onClick={onAddLikeToComment}
                  alt="like"
                />
                &nbsp;{likesCount}
              </Row>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Col flex={1}>
                <Row justify="end" className="clickable">
                  {isOwner && (
                    <>
                      <PopConfirm
                        title={t(ARE_YOU_SURE_DELETE_COMMENT_MSG)}
                        actionText={
                          <div className="delete-comment">
                            <img src={icons.deleteIco.icon} alt="delete icon" />
                          </div>
                        }
                        okText={t(YES)}
                        cancelText={t(NO)}
                        onConfirm={onDeleteComment}
                      />
                      &nbsp;&nbsp;
                      <img src={icons.edit.icon} alt="edit icon" onClick={() => setIsEditMode?.(!isEditMode)} />{' '}
                      &nbsp;&nbsp;
                    </>
                  )}
                  {!isOwner && withExtraActions && <img src={discussionsIcons.flag.icon} onClick={onSpamComment} />}
                </Row>
              </Col>
            </Row>
          </>
        )}
      </>
    </>
  );
};

export default SingleComment;
