import { UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Form, List, Modal, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Client, Question } from '../../../API';
import { getLayoutDirection } from '../../../app/layouts';
import { likeEntity } from '../../../app/providers/api';
import { useMainContext } from '../../../app/providers/main';
import { useModal } from '../../../app/providers/modal';
import icons from '../../../assets/icons';
import { ideaIcons } from '../../../assets/icons/idea';
import CommentsSection from '../../../components/comments_section';
import { Container } from '../../../components/container';
import { Likers } from '../../../components/likers';
import { ModalTitle } from '../../../components/modal_title';
import { OK, PEOPLE_WHO_LIKE_THIS, SEND } from '../../../locales/strings';
import { getClientProfile, getLikesNumber, getUserName } from '../../../utils';
import { LOGIN_ROUTE } from '../../../utils/routes';
import { getTimeFormatBasedOnLanguage } from '../utils';
import { CompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/complete_personal_profile';
import { useCompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import * as analytics from '../../../analytics';

interface Props {
  question: Question;
  client: Client;
}

export const SingleQuestion = ({ question, client }: Props) => {
  const { requestApi, userState } = useMainContext();
  const { showModal } = useModal();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [isLlike, setIsLike] = useState<boolean>(question?.is_liked!);
  const [isWriteComment, setIsWriteComment] = useState<boolean>(true);
  const [likesCount, setLikesCount] = useState<number>(question.likes_count!);
  const user = question?.client || client;
  const { isCompletePersonalProfile, errors, profile, setProfile, submit, saveSnapshot, restoreSnapshot } =
    useCompletePersonalProfile();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [form] = Form.useForm();

  const onAddLikeToQuestion = (id: string) => {
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
    }
    requestApi(likeEntity, { resourceId: id }, (response: { message: string; status: string }, error: string) => {
      if (error) {
        return;
      }
      const like = response.status === 'CREATED' ? true : false;
      setIsLike(like);
      const numbers = getLikesNumber(likesCount, like);
      setLikesCount(numbers);
      analytics.PublishEvent(new analytics.AnalyticsLikeEvent(analytics.ItemType.Idea, id));
    });
  };

  const showLikers = (questionId: string) => {
    showModal(
      <ModalTitle title={t(PEOPLE_WHO_LIKE_THIS)} icon={icons.invite.icon} />,
      <Likers resourceId={questionId} />,
      'modal-wrapper clients-like-questions-modal',
      t(OK)
    );
  };

  const onOpenComment = () => {
    setIsWriteComment(true);
  };

  const onShowTotalNumber = (counts: number) => {
    question.comments_count = counts;
  };

  const onAddComment = () => {
    if (userState.isAuthenticated === false) {
      return true;
    }
    if (isCompletePersonalProfile) {
      return true;
    } else {
      setShowCompleteProfile(true);
      return false;
    }
  };

  return (
    <>
      <List.Item id={question.id}>
        <List.Item.Meta
          avatar={
            <div onClick={() => getClientProfile(history, user)}>
              <Avatar size={45} icon={<UserOutlined />} src={user?.profile_image} />
            </div>
          }
          title={
            <Row justify="space-between" align="middle">
              <Col xl={8} lg={8} md={12} sm={12} xs={12}>
                <Typography.Text className="username clickable" onClick={() => getClientProfile(history, user)}>
                  {getUserName(user)}
                </Typography.Text>
              </Col>
              <Col
                xl={6}
                lg={6}
                md={12}
                sm={12}
                xs={12}
                className={`question-time ${getLayoutDirection(i18n.language)}`}
              >
                {getTimeFormatBasedOnLanguage(question?.created_at!)}
              </Col>
            </Row>
          }
          description={
            <div>
              <Typography.Text className="item-description">{`${question.title || ''}
            ${!question.description || question.description == null ? '' : '-'}
             ${question.description || ''}`}</Typography.Text>
            </div>
          }
        />
        <div className="comment-like-wrapper">
          <span className="like-wrapper">
            <span className="action-text">
              <img
                src={isLlike ? icons.love.icon : ideaIcons.like.icon}
                onClick={() => onAddLikeToQuestion(question?.id!)}
              />
              <span onClick={() => showLikers(question.id!)}>{likesCount}</span>
            </span>
          </span>
          <span className="comment-icon clickable" onClick={onOpenComment}>
            <img src={ideaIcons.comment.icon} />
            <span className="action-text">{question.comments_count}</span>
          </span>
        </div>
        <Container>
          {isWriteComment && (
            <>
              <CommentsSection
                onAddComment={onAddComment}
                client={client}
                resourceId={question.id}
                withExtraActions={false}
                onShowTotalNumber={onShowTotalNumber}
                analyticsItemType={analytics.ItemType.Idea_comment}
              />
              <Modal
                visible={showCompleteProfile}
                footer={null}
                onCancel={(e) => {
                  restoreSnapshot();
                  setShowCompleteProfile(false);
                }}
              >
                <Form
                  form={form}
                  onFieldsChange={(fields) => {
                    fields.forEach((field) => {
                      setProfile((pre) => ({ ...pre, [field.name as string]: field.value }));
                    });
                  }}
                >
                  <CompletePersonalProfile
                    onInit={saveSnapshot}
                    onComplete={() => {
                      setShowCompleteProfile(false);
                    }}
                    errors={errors}
                    profile={profile}
                    setProfile={setProfile}
                    submit={async () => {
                      try {
                        const updated = await submit();
                        setShowCompleteProfile(false);
                        return updated;
                      } catch (error) {
                        return Promise.reject();
                      }
                    }}
                  />
                </Form>
              </Modal>
            </>
          )}
        </Container>
      </List.Item>
      <br />
    </>
  );
};
