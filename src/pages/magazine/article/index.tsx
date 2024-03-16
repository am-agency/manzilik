import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Col, Row, Typography } from 'antd';

import { useTranslation } from 'react-i18next';
import { useClient } from '../../../app/hooks/use_client';

import {
  COMMENTS,
  READ_RELATED_STORIES,
  SAVE,
  PEOPLE_WHO_LIKED_THIS_STORY,
  LIKE,
  SEND,
  SEND_BY_EMAIL,
  EMBED_A_WIDGET,
  EMBED,
  READ_MORE,
  ARTICLE_SEO_DESCRIPTION,
} from '../../../locales/strings';

import { mockProjectsList } from '../../../mocks/data-mock/utils';
import { COMMENTS_TEXT, RelatedSideListType } from '../../../app/settings';
import { getClientProfile, getIcon, getLikesNumber, getUserName, scrollToSection } from '../../../utils';
import { getTimeFormatBasedOnLanguage, toArrayOrEmpty } from '../../idea/utils';

import { ideaIcons } from '../../../assets/icons/idea';
import { Container } from '../../../components/container';
import GreyButton from '../../../components/grey_button';
import Separator from '../../../components/separator';
import { RelatedSideList } from '../../../components/related_side_list';
import { TagsList } from '../../../components/tags_list';
import { magazineIcons } from '../../../assets/icons/magazine';
import { ArticleCard } from '../home/components/article_card';
import { ArticleContent } from './components/article_content';
import DropdownPopover from '../../../components/dropdown_popover';
import CommentsSection from '../../../components/comments_section';
import { useHistory, useParams } from 'react-router-dom';
import { useMainContext } from '../../../app/providers/main';
import { getMagazineDetailsFromApi, getRelatedStories } from '../api';
import { useModal } from '../../../app/providers/modal';
import { ModalTitle } from '../../../components/modal_title';
import { LOGIN_ROUTE } from '../../../utils/routes';
import { SaveIdeaForm } from '../../idea/forms/save_idea';
import SendMessageForm from '../../../components/send_message_form';
import icons from '../../../assets/icons';
import { likeEntity } from '../../../app/providers/api';
import { EmbedCode } from '../../../components/embed_code';
import { Category, Indices, Magazine as MagazineFromApi } from '../../../API';
import { EntityTags, GenericEntity, Magazine } from '../../../components/idea/types';
import { MoreOnManzilik } from './components/more_on_manzilik';
import { getModalTitle } from '../../../components/idea/utils';
import ReadMoreText from '../../../components/read_more_text';
import { MetaTags } from '../../../components/meta_tags';
import * as analytics from '../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import SimilarGigs from '../../request_gig/components/similar_gigs';

interface Props {
  magazine: Magazine;
}

const Article = (props: Props) => {
  const { t } = useTranslation();
  const [magazine, setMagazine] = useState<Magazine | undefined>();
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { id } = useParams<{ id: string }>();
  const { requestApi, userState } = useMainContext();
  const [isLiked, setIsLiked] = useState<boolean>(magazine?.is_liked!);
  const [relatedStories, setRelatedStories] = useState<MagazineFromApi[]>();
  const [likesCount, setLikesCount] = useState<number | null | undefined>(magazine?.likes_count);
  const [commentsCount, setCommentsCount] = useState<number>();
  const [showPopOver, setShowPopOver] = useState<boolean>(true);
  const { showModal } = useModal();
  const history = useHistory();

  const getMagazineDetails = () => {
    requestApi(
      getMagazineDetailsFromApi,
      { id, isAuthenticated: userState.isAuthenticated },
      (article: MagazineFromApi, error: string) => {
        if (error) {
          return;
        }
        setMagazine({ ...article, page: JSON.parse(article.page!) });
        if (article && history?.location?.hash?.includes(COMMENTS_TEXT)) {
          // this is because magazine content/body will be taken from html not from state, so I have to scroll after displaying the content unless will scroll to the wrong position which is comments section before html displays the content
          setTimeout(() => {
            scrollToSection(COMMENTS_TEXT);
          }, 500);
        }
      }
    );
  };

  const getRelatedMagazines = () => {
    requestApi(getRelatedStories, { id, search_by: 'magazines' }, (articles: GenericEntity[], error: string) => {
      setRelatedStories(articles && articles?.map((story) => JSON.parse(story?.data || ''))!);
      if (error) {
        return;
      }
    });
  };

  const onSaveMagazine = () => {
    showModal(
      <ModalTitle title={getModalTitle(EntityTags.MAGAZINE, t)} />,
      <SaveIdeaForm entity={magazine!} client={magazine?.client!} tag={EntityTags.MAGAZINE} />,
      'modal-wrapper move-idea-modal save-idea-modal',
      t(SAVE)
    );
  };

  const onLikeMagazine = () => {
    if (userState.isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(getLikesNumber(likesCount!, !isLiked));
      requestApi(likeEntity, { resourceId: magazine?.id }, (response: string, error: string) => {
        if (error) {
          return;
        }
        analytics.PublishEvent(new analytics.AnalyticsLikeEvent(analytics.ItemType.Magazine_article, magazine?.id!));
      });
    } else {
      showModal(<ModalTitle />, <div />, '', '');
    }
  };

  const scrollToWriteCommentSection = () => {
    scrollToSection('write-comment');
  };

  const onShareMagazine = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm project={mockProjectsList[0]} shareItem="article" />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  const onEmbedMagazine = () => {
    const { REACT_APP_BASE_URL } = process.env;

    showModal(
      <ModalTitle icon={icons.email.icon} title={t(EMBED_A_WIDGET)} />,
      <EmbedCode
        link={`${REACT_APP_BASE_URL}/magazine/${magazine?.title}/${id}`}
        preview_photo_url={magazine?.photo!}
      />,
      'send-email-modal-wrapper modal-wrapper',
      t(EMBED)
    );
    setShowPopOver(false);
  };

  useEffect(() => {
    setShowPopOver(true);
  }, [showPopOver]);

  useEffect(() => {
    getMagazineDetails();
    getRelatedMagazines();
  }, [id]);

  useEffect(() => {
    setIsLiked(magazine?.is_liked!);
  }, [magazine?.is_liked]);

  useEffect(() => {
    setLikesCount(magazine?.likes_count!);
  }, [magazine?.likes_count]);

  return (
    <Container>
      <MetaTags title={magazine?.title!} description={ARTICLE_SEO_DESCRIPTION} />
      <Row gutter={32} className="magazine-single-page">
        <Col xl={16} lg={16} md={14} sm={24} xs={24}>
          <div className="story-tags">
            <TagsList
              tags={toArrayOrEmpty(magazine?.categories).map((el: Category) => el.title)}
              onTagSelect={(index: number) => {
                history.push(`/magazines/${toArrayOrEmpty(magazine?.categories)[index].id}`);
              }}
            />
          </div>
          <h1 className="article-heading">{magazine?.title}</h1>
          <img className="img-fit-content rounded-border magazine-featured-img" src={magazine?.photo!} />
          <Row wrap={false} className="photo-title-wrapper">
            <Avatar src={magazine?.client?.profile_image} size={50} />
            &nbsp;&nbsp;
            <div className="title-wrapper">
              <Typography.Text onClick={() => getClientProfile(history, magazine?.client!)}>
                {getUserName(magazine?.client)}
              </Typography.Text>
              <Row>
                <Typography.Text className="createdAt-text">
                  {getTimeFormatBasedOnLanguage(magazine?.created_at!)}
                </Typography.Text>
              </Row>
            </div>
          </Row>
          <ReadMoreText text={magazine?.client?.about_me!} actionText={t(READ_MORE)} />
          <Separator vertical={20} />
          <Row>
            <Col xl={18} lg={18} md={18} sm={24} xs={24}>
              <Row>
                {/* <GreyButton text={t(SAVE)} icon={ideaIcons.save.icon} onClick={onSaveMagazine} /> */}
                <Separator horizontal={8} />
                <GreyButton
                  text={t(LIKE, { count: likesCount! })}
                  icon={getIcon(ideaIcons.like, isLiked)}
                  count={likesCount!}
                  onClick={onLikeMagazine}
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
                <GreyButton icon={magazineIcons.export.icon} onClick={onShareMagazine} />
                <Separator horizontal={8} />
                <DropdownPopover
                  content={
                    <div>
                      <div className="popover-item" onClick={window.print}>
                        <img src={magazineIcons.print.icon} />
                        &nbsp;&nbsp; {t(magazineIcons.print.title)}
                      </div>
                      <div className="popover-item" onClick={onEmbedMagazine}>
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
          <Separator vertical={48} />
          <ArticleContent magazine={magazine}></ArticleContent>
          <MoreOnManzilik />
          <Separator vertical={45} />
          <CommentsSection
            client={client}
            resourceId={magazine?.id}
            onShowTotalNumber={setCommentsCount}
            analyticsItemType={analytics.ItemType.Magazine_comment}
          />

          {/* <Typography.Text className="story-single-page-headings">{t(EXPLORE_RELATED_TOPICS)}</Typography.Text> */}
          {/* <Separator vertical={20} /> */}
          {/* <TagsList tags={['Feel-Good Home', 'Most Popular', 'Kitchen Design']} /> */}

          {relatedStories?.slice(4, 8).length! > 0 && (
            <>
              <Typography.Text className="story-single-page-headings">{t(READ_RELATED_STORIES)}</Typography.Text>
              <Separator vertical={25} />
              <Row gutter={{ sm: 4, md: 4, lg: 32, xl: 32 }}>
                {relatedStories?.slice(4, 8).map((el, i) => (
                  <Col lg={12} md={12} sm={24} xs={24} key={i}>
                    <ArticleCard withTag tag={''} magazine={el} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
        <Col xl={8} lg={8} md={10} sm={24} xs={24} className="related-article">
          <RelatedSideList
            list={relatedStories?.slice(0, 4)!}
            title={t(PEOPLE_WHO_LIKED_THIS_STORY)}
            action={RelatedSideListType.withRefLink}
            baseRedirectUrl={'/magazine/'}
          />
        </Col>
      </Row>
      <Row>
        <Col xl={15} lg={20} md={24} sm={24} xs={24}>
          <SimilarGigs type={Indices.MAGAZINE} />
        </Col>
      </Row>
    </Container>
  );
};

export default Article;
