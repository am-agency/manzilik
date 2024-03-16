import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Popconfirm, Skeleton, Typography, message, Modal, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useClient } from '../../../app/hooks/use_client';
import discussionsIcons from '../../../assets/icons/discussions';
import { ideaIcons } from '../../../assets/icons/idea';
import icons from '../../../assets/icons';

import Avatar from '../../../components/avatar';
import {
  MORE_DISCUSSIONS,
  RELATED_DISCUSSIONS,
  SAVE,
  WRITE_COMMENT,
  REMOVE,
  OK,
  CANCEL,
  ARE_YOU_SURE_DELETE_IDEA,
  REPORT_SPAM,
  SUBMIT,
  LINK_COPIED,
  SHARE,
  DISCUSSIONS,
  HOME_PAGE_SEO_DESCRIPTION,
  MANZILIK,
} from '../../../locales/strings';
import { getTimeFormatBasedOnLanguage, toArrayOrEmpty } from '../../idea/utils';
import { TagsList } from '../../../components/tags_list';
import { RelatedSideList } from '../../../components/related_side_list';
import Separator from '../../../components/separator';
import { Indices, Topic } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { useHistory, useParams, useLocation } from 'react-router';
import { getDiscussionDetails, deleteDiscussion, listMostRecentDiscussions, listRelatedDiscussions } from '../api';
import { getUserName, scrollToSection } from '../../../utils';
import GreyButton from '../../../components/grey_button';
import CommentsSection from '../../../components/comments_section';
import { RelatedSideListType } from '../../../app/settings';
import { useModal } from '../../../app/providers/modal';
import { ModalTitle } from '../../../components/modal_title';
import { SaveIdeaForm } from '../../idea/forms/save_idea';
import { BaseEntity, Discussion, EntityTags } from '../../../components/idea/types';
import { UserOutlined } from '@ant-design/icons';
import { SpamList } from '../../../components/comments_section/comment/spam_list';
import { getModalTitle } from '../../../components/idea/utils';
import { MetaTags } from '../../../components/meta_tags';
import { useCompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import { CompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/complete_personal_profile';
import { ItemType } from '../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import SimilarGigs from '../../request_gig/components/similar_gigs';

const DiscussionDetails = () => {
  const { t } = useTranslation();
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { requestApi, userState } = useMainContext();
  const { showModal } = useModal();
  const { pathname } = useLocation();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion>();
  const [moreDiscussions, setMoreDiscussions] = useState<Discussion[]>([]);
  const [relatedDiscussions, setRelatedDiscussions] = useState<Discussion[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>();
  const { isCompletePersonalProfile, errors, profile, setProfile, submit, saveSnapshot, restoreSnapshot } =
    useCompletePersonalProfile();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [form] = Form.useForm();

  const isOwner = client?.id === discussion?.client?.id;

  const fetchDiscussionDetails = () => {
    requestApi(getDiscussionDetails, id, (discussion: BaseEntity, error: string) => {
      if (error) {
        return;
      }
      setDiscussion(discussion);
    });
  };

  const getMoreDiscussions = () => {
    requestApi(
      listMostRecentDiscussions,
      { input: { offset: 1, limit: 4, id } },
      (response: { discussions: Discussion[]; discussions_total: number }, error: string) => {
        if (error) {
          return;
        }
        setMoreDiscussions(response.discussions);
      }
    );
  };

  const getRelatedDiscussions = () => {
    requestApi(
      listRelatedDiscussions,
      { resourceId: discussion?.id, offset: 0, limit: 4 },
      (discussions: Discussion[], error: string) => {
        if (error) {
          return;
        }
        setRelatedDiscussions(discussions);
      }
    );
  };

  const onSaveDiscussion = () => {
    showModal(
      <ModalTitle title={getModalTitle(EntityTags.DISCUSSION, t)} />,
      <SaveIdeaForm entity={discussion!} client={discussion?.client!} tag={EntityTags.DISCUSSION} />,
      'modal-wrapper move-idea-modal save-idea-modal',
      t(SAVE)
    );
  };

  const onShareDiscussion = () => {
    message.destroy();
    navigator.clipboard.writeText(process.env.REACT_APP_BASE_URL + pathname);
    message.success(`${t(LINK_COPIED)}: ${process.env.REACT_APP_BASE_URL + pathname}`);
  };

  const onDeleteDiscussion = () => {
    if (userState.isAuthenticated) {
      requestApi(deleteDiscussion, discussion?.id, (result: { message: string }, error: string) => {
        if (error) {
          return;
        }
        history.push('/discussions');
      });
    } else {
      history.push('/login');
    }
  };

  const onSpamDiscussion = () => {
    showModal(t(REPORT_SPAM), <SpamList entityId={discussion?.id} />, 'modal-wrapper', t(SUBMIT));
  };

  const scrollToWriteCommentSection = () => {
    scrollToSection('write-comment');
  };

  useEffect(() => {
    fetchDiscussionDetails();
    getMoreDiscussions();
  }, [id]);

  useEffect(() => {
    if (discussion?.id) {
      getRelatedDiscussions();
    }
  }, [discussion?.id]);

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
    <Row justify="center">
      <MetaTags title={`${t(MANZILIK)} | ${t(DISCUSSIONS)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <Col xl={20} lg={20} md={22} sm={22} xs={22} className="discussion-details-page">
        <Separator horizontal={16} vertical={16} />
        <TagsList
          tags={discussion?.topics?.map((tp: Topic) => tp.title!)}
          onTagSelect={(index: number) => {
            history.push('/discussions/' + toArrayOrEmpty(discussion?.topics)[index].id);
          }}
        />
        <Separator horizontal={8} vertical={8} />
        <Row wrap justify="center" gutter={32}>
          <Col xl={14} lg={14} md={12} sm={24} xs={24}>
            <Row wrap={false} className="photo-title-wrapper">
              <Avatar src={discussion?.client?.profile_image} size={50} icon={<UserOutlined />} />
              &nbsp;&nbsp;
              <div className="title-wrapper">
                {discussion?.title ? (
                  <h1 className="discussion-head">{discussion?.title}</h1>
                ) : (
                  <Skeleton.Input size={'small'} />
                )}
                <Row>
                  {discussion?.client ? (
                    <Typography.Text className="client-name-text">{getUserName(discussion?.client)}</Typography.Text>
                  ) : (
                    <Skeleton.Input className="client-name-text-skeleton" size="small" />
                  )}
                  <Typography.Text className="createdAt-text">
                    &nbsp;&nbsp; . &nbsp;&nbsp;
                    {getTimeFormatBasedOnLanguage(discussion?.created_at!)}
                  </Typography.Text>
                </Row>
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <div className="clickable icon">
                {client?.id !== discussion?.client?.id && (
                  <img className="flag-icon" src={discussionsIcons.flag.icon} onClick={onSpamDiscussion} />
                )}
              </div>
            </Row>
            <Separator horizontal={16} vertical={16} />
            <div className="description  ql-editor" dangerouslySetInnerHTML={{ __html: discussion?.description! }} />
            <Separator horizontal={16} vertical={16} />
            {discussion?.polls?.map((elem, index: number) => (
              <Row justify="space-between" align="middle" className="poll-question" key={index}>
                {elem.photo_url ? (
                  <>
                    <Row justify="center" align="middle" className="poll-photo-and-title">
                      <Avatar shape="square" size={40} src={elem.photo_url} />
                      <Separator horizontal={5} />
                      <div className="poll-title">{elem.title}</div>
                    </Row>
                    {/* @TODO: will enable this when it's done from backend
                     <Separator horizontal={20} />
                    <GreyButton text={t(VOTE)} /> */}
                  </>
                ) : (
                  <>
                    <p>{elem.title}</p>
                    {/* <GreyButton text={t(VOTE)} /> */}
                  </>
                )}
              </Row>
            ))}
            <Separator horizontal={16} />
            <Row className="discussion-actions">
              <GreyButton className="" text={t(SHARE)} icon={icons.social_medai.icon} onClick={onShareDiscussion} />
              <Separator horizontal={16} />
              <GreyButton text={t(SAVE)} icon={ideaIcons.save.icon} onClick={onSaveDiscussion} />
              <Separator horizontal={16} />
              <GreyButton
                text={t(WRITE_COMMENT)}
                icon={ideaIcons.comment.icon}
                count={commentsCount}
                onClick={() => {
                  scrollToWriteCommentSection();
                }}
              />
              {isOwner && (
                <>
                  <Separator horizontal={16} />
                  <Popconfirm
                    overlayClassName="pop-confirm"
                    title={t(ARE_YOU_SURE_DELETE_IDEA, { project: '' })}
                    okText={t(OK)}
                    cancelText={t(CANCEL)}
                    onConfirm={onDeleteDiscussion}
                  >
                    <GreyButton text={t(REMOVE)} icon={icons.remove.icon} />
                  </Popconfirm>
                </>
              )}
            </Row>
            <Separator vertical={25} />
            <CommentsSection
              onAddComment={onAddComment}
              client={client}
              resourceId={discussion?.id}
              onShowTotalNumber={setCommentsCount}
              analyticsItemType={ItemType.Discussion_comment}
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
          </Col>
          <Col xl={10} lg={10} md={12} sm={24} xs={24}>
            <RelatedSideList
              list={moreDiscussions}
              title={t(MORE_DISCUSSIONS)}
              action={RelatedSideListType.withComment}
              baseRedirectUrl={`/discussion/`}
            />
            {relatedDiscussions.length !== 0 && (
              <RelatedSideList
                list={relatedDiscussions}
                title={t(RELATED_DISCUSSIONS)}
                action={RelatedSideListType.withComment}
                baseRedirectUrl={`/discussion/`}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col xl={15} lg={20} md={24} sm={24} xs={24}>
            <SimilarGigs type={Indices.DISCUSSION} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DiscussionDetails;
