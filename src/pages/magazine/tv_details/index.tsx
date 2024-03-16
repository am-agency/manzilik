import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  COMMENTS,
  EMBED,
  EMBED_A_WIDGET,
  LIKE,
  MANZILIK_TV,
  READ_RELATED_STORIES,
  SAVE,
  SEND,
  SEND_BY_EMAIL,
  TV_DETAILS_SEO_DESCRIPTION,
} from '../../../locales/strings';
import GreyButton from '../../../components/grey_button';
import CommentsSection from '../../../components/comments_section';
import { mockProjectsList } from '../../../mocks/data-mock/utils';
import icons from '../../../assets/icons';
import { ideaIcons } from '../../../assets/icons/idea';
import { RelatedSideList } from '../../../components/related_side_list';
import Separator from '../../../components/separator';
import { RelatedSideListType } from '../../../app/settings';
import { useHistory, useParams } from 'react-router-dom';
import { TV as TVFromApi } from '../../../API';
import { useClient } from '../../../app/hooks/use_client';
import { useMainContext } from '../../../app/providers/main';
import { getRelatedStories, getTVDetails as getTVDetailsFromApi } from '../api';
import { ModalTitle } from '../../../components/modal_title';
import { SaveIdeaForm } from '../../idea/forms/save_idea';
import { useModal } from '../../../app/providers/modal';
import { LOGIN_ROUTE, TV_ROUTE } from '../../../utils/routes';
import { extractVideoUrl, getIcon, getLikesNumber, scrollToSection } from '../../../utils';
import DropdownPopover from '../../../components/dropdown_popover';
import { magazineIcons } from '../../../assets/icons/magazine';
import SendMessageForm from '../../../components/send_message_form';
import { likeEntity } from '../../../app/providers/api';
import { EntityTags, GenericEntity, TV } from '../../../components/idea/types';
import { EmbedCode } from '../../../components/embed_code';
import { ArticleContent } from '../article/components/article_content';
import { getModalTitle } from '../../../components/idea/utils';
import { MetaTags } from '../../../components/meta_tags';
import * as analytics from '../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';

export const TVDetails = () => {
  const { t } = useTranslation();
  const [tv, setTV] = useState<TV | undefined>();
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { id } = useParams<{ id: string }>();
  const { requestApi, userState } = useMainContext();
  const [isLiked, setIsLiked] = useState<boolean>(tv?.is_liked!);
  const [isSaved, setIsSaved] = useState<boolean>();
  const [likesCount, setLikesCount] = useState<number | null | undefined>(tv?.likes_count);
  const [relatedStories, setRelatedStories] = useState<TVFromApi[]>();
  const [commentsCount, setCommentsCount] = useState<number>();
  const [showPopOver, setShowPopOver] = useState<boolean>(true);

  const { showModal } = useModal();
  const history = useHistory();

  const getTVDetails = () => {
    requestApi(
      getTVDetailsFromApi,
      { id, isAuthenticated: userState.isAuthenticated },
      (tv: TVFromApi, error: string) => {
        setTV({ ...tv, page: JSON.parse(tv.page!) });
        if (error) {
          return;
        }
      }
    );
  };

  const onSaveTv = () => {
    showModal(
      <ModalTitle title={getModalTitle(EntityTags.TV, t)} />,
      <SaveIdeaForm entity={tv!} client={tv?.client!} tag={EntityTags.TV} postSaveIdea={() => setIsSaved(true)} />,
      'modal-wrapper move-idea-modal save-idea-modal',
      t(SAVE)
    );
  };

  const onLikeTV = () => {
    if (userState.isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(getLikesNumber(likesCount!, !isLiked));
      requestApi(likeEntity, { resourceId: tv?.id }, (response: string, error: string) => {
        if (error) {
          return;
        }
        analytics.PublishEvent(new analytics.AnalyticsLikeEvent(analytics.ItemType.Magazine_tv, tv?.id!));
      });
    } else {
      showModal(<ModalTitle />, <div />, '', '');
    }
  };

  const getRelatedTVs = () => {
    requestApi(getRelatedStories, { id, search_by: 'tvs' }, (tvs: GenericEntity[], error: string) => {
      setRelatedStories(tvs?.map((tv) => JSON.parse(tv?.data))!);
      if (error) {
        return;
      }
    });
  };

  const scrollToWriteCommentSection = () => {
    scrollToSection('write-comment');
  };

  const onShareTv = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm project={mockProjectsList[0]} shareItem="article" />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  const onEmbedTV = () => {
    const { REACT_APP_BASE_URL } = process.env;
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(EMBED_A_WIDGET)} />,
      <EmbedCode link={`${REACT_APP_BASE_URL}tv/${id}`} preview_photo_url={tv?.photo!} />,
      'send-email-modal-wrapper modal-wrapper',
      t(EMBED)
    );
    setShowPopOver(false);
  };

  useEffect(() => {
    setShowPopOver(true);
  }, [!showPopOver]);

  useEffect(() => {
    getTVDetails();
    getRelatedTVs();
  }, [id]);

  useEffect(() => {
    setLikesCount(tv?.likes_count!);
  }, [tv?.likes_count]);

  useEffect(() => {
    setIsLiked(tv?.is_liked!);
  }, [tv?.is_liked]);

  return (
    <Col span={24} className="tv-details-container">
      <MetaTags title={tv?.title!} description={TV_DETAILS_SEO_DESCRIPTION} />
      <div className="video">
        <iframe src={extractVideoUrl(tv?.video_url || '')} />
      </div>
      <Separator vertical={20} />
      <Row justify="center">
        <Col xl={20} lg={20} md={22} xs={22} sm={22}>
          <Row justify="center" gutter={16}>
            <Col xl={14} lg={14} md={12} sm={24} xs={24}>
              <Typography.Text
                strong
                className="manzilik-tv-text"
                onClick={() => {
                  history.push(TV_ROUTE);
                }}
              >
                {t(MANZILIK_TV)}
              </Typography.Text>
              <Separator vertical={12} />
              <Row>
                <Col xl={18} lg={18} md={12} sm={24} xs={24}>
                  <Row>
                    <GreyButton
                      text={t(SAVE)}
                      icon={isSaved ? ideaIcons.save.filledIcon : ideaIcons.save.icon}
                      onClick={onSaveTv}
                    />
                    <Separator horizontal={8} />
                    <GreyButton
                      text={t(LIKE, { count: likesCount! })}
                      icon={getIcon(ideaIcons.like, isLiked)}
                      count={likesCount!}
                      onClick={onLikeTV}
                    />
                    <Separator horizontal={8} />
                    <GreyButton
                      text={t(COMMENTS, { count: commentsCount })}
                      icon={ideaIcons.comment.icon}
                      count={commentsCount}
                      onClick={scrollToWriteCommentSection}
                    />
                    <Separator horizontal={8} />
                  </Row>
                </Col>
                <Col xl={6} lg={6} md={12} sm={24} xs={24}>
                  <Row justify="end" className="options-and-export-btns-wrapper">
                    <GreyButton icon={magazineIcons.export.icon} onClick={onShareTv} />
                    <Separator horizontal={8} />
                    <DropdownPopover
                      content={
                        <div>
                          <div className="popover-item" onClick={window.print}>
                            <img src={magazineIcons.print.icon} />
                            &nbsp;&nbsp; {t(magazineIcons.print.title)}
                          </div>
                          <div className="popover-item" onClick={onEmbedTV}>
                            <img src={magazineIcons.embed.icon} />
                            &nbsp;&nbsp; {t(magazineIcons.embed.title)}
                          </div>
                        </div>
                      }
                      trigger={'click'}
                      showPopOver={showPopOver}
                    >
                      <GreyButton icon={ideaIcons.options.icon} />
                    </DropdownPopover>
                    <Separator horizontal={8} />
                  </Row>
                </Col>
              </Row>
              <Separator vertical={16} />
              <h1 className="tv-title">{tv?.title}</h1>
              <ArticleContent magazine={tv} />

              <CommentsSection
                client={client}
                resourceId={tv?.id}
                onShowTotalNumber={setCommentsCount}
                analyticsItemType={analytics.ItemType.Magazine_comment}
              />
            </Col>
            <Col xl={10} lg={10} md={10} sm={24} xs={24} className="related-article">
              <RelatedSideList
                list={relatedStories!}
                title={t(READ_RELATED_STORIES)}
                action={RelatedSideListType.withComment}
                baseRedirectUrl={'/tv/'}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default TVDetails;
