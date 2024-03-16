import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Card, CardProps, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { ideaIcons } from '../../../../assets/icons/idea';
import icons from '../../../../assets/icons';

import { useTranslation } from 'react-i18next';
import { BY, SAVE, SAVE_IDEA, SEND, SEND_BY_EMAIL } from '../../../../locales/strings';
import {
  getClientProfile,
  getClientProfileLink,
  getIdeaLink,
  getLikesNumber,
  getUserName,
  modifyImageUrl,
} from '../../../../utils';
import { useHistory } from 'react-router';
import { ModalTitle } from '../../../../components/modal_title';
import { SaveIdeaForm } from '../../forms/save_idea';
import { useModal } from '../../../../app/providers/modal';
import { useState } from 'react';
import SendMessageForm from '../../../../components/send_message_form';
import { useMainContext } from '../../../../app/providers/main';
import { Icon } from '../../types';
import { getLayoutDirection } from '../../../../app/layouts';
import i18n from '../../../../app/i18n';
import { EntityTags, Idea, Project } from '../../../../components/idea/types';
import { likeEntity } from '../../../../app/providers/api';
import { getModalTitle } from '../../../../components/idea/utils';
import { COMMENTS_TEXT } from '../../../../app/settings';
import { Link } from 'react-router-dom';
import * as analytics from '../../../../analytics';
import DefaultImage from '../../../../assets/images/default/Defult-Image-434.png';

interface Props {
  hideActions?: boolean;
  project?: Project;
  idea: Idea;
}

/** This is the second component for idea card, this card has a different style (includes likes, share and questions) and without hovering.
 * it's used inside home, client and professional pages
 *
 * @param props: idea and project
 * @returns an idea photo and the project details -where this idea belongs-
 */

export const IdeaCard = ({ idea, project, hideActions }: CardProps & Props) => {
  project = project! || idea?.project;
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(project?.is_liked!);
  const [likesCount, setLikesCount] = useState<number | null | undefined>(project?.likes_count);
  const { userState, requestApi } = useMainContext();
  const history = useHistory();
  const { showModal } = useModal();
  const ideaPath = getIdeaLink(idea, project);

  const client = idea?.client || project?.client;

  useEffect(() => {
    setIsLiked(project?.is_liked!);
  }, [project?.is_liked, project?.id]);

  const onSaveIdea = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    showModal(
      <ModalTitle title={getModalTitle(EntityTags.IDEA, t)} icon={ideaIcons.save.icon} />,
      <SaveIdeaForm
        projectId={project?.id!}
        entity={idea}
        client={project?.client!}
        postSaveIdea={(isSaved: boolean) => {
          setIsSaved(isSaved);
        }}
        tag={EntityTags.IDEA}
      />,
      'modal-wrapper save-idea-modal',
      t(SAVE)
    );
  };

  const showEmailIdeaModal = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm idea={idea} shareItem="idea" />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  const goToIdeaComments = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    history.push(`${ideaPath}/#${COMMENTS_TEXT}`);
  };

  const onLikeIdea = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    if (userState.isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(getLikesNumber(likesCount!, !isLiked));
      requestApi(likeEntity, { resourceId: project?.id }, (response: string, error: string) => {
        if (error) {
          return;
        }
        analytics.PublishEvent(new analytics.AnalyticsLikeEvent(analytics.ItemType.Idea, idea.id!));
      });
    } else {
      showModal(<ModalTitle />, <div />, '', SEND);
    }
  };

  const getIcon = (icon: Icon, isFilled?: boolean) => {
    if (userState.isAuthenticated) {
      return isFilled ? icon.filledGreyIcon : icon.greyIcon;
    }
    return icon.icon;
  };

  const ideaImage = useMemo(() => {
    if (idea?.photo!) {
      return modifyImageUrl(idea?.photo!, 525, 350);
    } else {
      return DefaultImage;
    }
  }, [idea?.photo]);

  return (
    <Link to={ideaPath}>
      <Card
        bordered
        className={`idea-card ${getLayoutDirection(i18n.language)}`}
        cover={
          <LazyLoadImage
            className="idea-thumb img-fit-content"
            alt={`${idea?.project?.title || project?.title}`}
            src={ideaImage}
          />
        }
        actions={
          hideActions
            ? []
            : [
                <div key={ideaIcons.like.title} onClick={onLikeIdea}>
                  <img src={getIcon(ideaIcons.like, isLiked)} />
                  <span className="number-text">{likesCount}</span>
                </div>,
                <div key={ideaIcons.comment.title} onClick={goToIdeaComments}>
                  <img src={getIcon(ideaIcons.comment)} />
                  <span className="number-text">{project?.questions_count}</span>
                </div>,
                <div key={ideaIcons.share.title} onClick={showEmailIdeaModal}>
                  <img src={getIcon(ideaIcons.share)} />
                  <span className="number-text">{project?.shares_count}</span>
                </div>,
                <div key={ideaIcons.save.title} onClick={onSaveIdea}>
                  <img src={getIcon(ideaIcons.save, isSaved)} />
                </div>,
              ]
        }
      >
        {/* if no project exists => no client will exist */}
        {client && (
          <Meta
            title={
              <Typography.Paragraph className="idea-title-text" ellipsis={{ rows: 1 }}>
                {project?.title || idea.title}{' '}
              </Typography.Paragraph>
            }
            description={
              <Typography.Paragraph ellipsis={{ rows: 1 }}>
                <Typography.Text className="by-text">{t(BY)} </Typography.Text>
                {/* @TODO: [MZWEB-48] incorrect-semantic  wrap this with an a */}
                <Link to={getClientProfileLink(client)}>
                  <Typography.Text
                    className="client-name-text clickable"
                    onClick={(event) => {
                      event?.stopPropagation();
                      getClientProfile(history, client);
                    }}
                  >
                    {getUserName(client)}
                  </Typography.Text>
                </Link>
              </Typography.Paragraph>
            }
          />
        )}
      </Card>
    </Link>
  );
};
