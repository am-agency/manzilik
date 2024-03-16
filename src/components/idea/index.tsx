import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Card, Checkbox, Row, Typography } from 'antd';
import { getLayoutDirection } from '../../app/layouts';
import { MyIdeas } from './my_ideas';
import { IdeasFromManzil } from './ideas_from_manzil';
import { useTranslation } from 'react-i18next';
import { IdeaDestination, IDEAS } from '../../app/settings';
import { SearchedIdea } from './searched_idea';
import { BY, SEE_THIS_PROJECT_ON_MANZILIK, SEND, SEND_BY_EMAIL } from '../../locales/strings';
import { getUserName, getClientProfile } from '../../utils';
import { BaseEntity, Project } from './types';
import SendMessageForm from '../send_message_form';
import { ModalTitle } from '../modal_title';
import { useModal } from '../../app/providers/modal';
import icons from '../../assets/icons';
import { getEntityTitle, getIdeaCardDirection } from './utils';

/**
 * this component is the idea card that is used inside the search page, the project page (myIdeas and ideasFromManzilik) tabs and magazine page.
 * @param entity: @example idea, discussion, magazine, and tv
 * @param tag: entity tag
 * @param project: the project where the idea belongs
 * @param organizeIdeas: variable to check if the user select `organize` option or not
 * @params organizeIdeas, selectIdeaForOperation, isSelected => these params related to organize option inside my ideas tab
 * @param ideaDestination the card where it belongs @example project or search page
 */

//@TODO: should abstract/refactor the copmonent to be more readable and clear

interface Props {
  entity?: BaseEntity;
  tag?: string;
  project?: Project;
  organizeIdeas?: boolean;
  selectIdeaForOperation?: Function;
  isSelected?: boolean;
  ideaDestination: string;
  postIdeaOperation?: Function;
  onAddIdeaToProject?: Function;
  isIdeaSelected?: boolean;
  onSaveIdea?: () => void;
}

export const IdeaCard: React.FunctionComponent<Props> = ({
  entity,
  organizeIdeas,
  selectIdeaForOperation,
  isSelected,
  ideaDestination,
  postIdeaOperation,
  onAddIdeaToProject,
  isIdeaSelected,
  tag,
  project,
}: Props) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const [isCardHoverVisible, setIsCardHoverVisible] = useState<boolean>(false);
  const [note, setNote] = useState<string>(entity?.description!);
  const { showModal } = useModal();
  const { REACT_APP_BASE_URL } = process.env;
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');

  const onCardHover = () => {
    setIsCardHoverVisible(false);
  };

  const onSendIdea = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm
        idea={entity}
        project={project}
        shareItem="idea"
        defaultMessageContent={`${t(SEE_THIS_PROJECT_ON_MANZILIK)}
      ${REACT_APP_BASE_URL}/${getIdeaCardDirection(entity!, project!)}`}
      />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  useEffect(() => {
    if (organizeIdeas) {
      setIsCardHoverVisible(false);
    }
  }, [organizeIdeas]);

  const onMouseLeave = () => {
    if (!organizeIdeas) {
      setIsCardHoverVisible(true);
    }
  };

  return (
    <div className="project-idea-card">
      {!isCardHoverVisible ? (
        <div
          onMouseEnter={onMouseLeave}
          className={`idea ${IdeaDestination.searchIdeas === ideaDestination && 'search-idea'}`}
        >
          {organizeIdeas && (
            <div
              className={`checkbox-btn checkbox-btn-${getLayoutDirection(i18n.language)}`}
              onClick={() => selectIdeaForOperation!(entity)}
            >
              <Checkbox checked={isSelected} />
            </div>
          )}
          <Card hoverable cover={<img src={entity?.photo!} alt={entity?.title!} className="img-fit-content" />} />
          {ideaDestination === IdeaDestination.MyIdeas && (
            <Row className="idea-note">
              <Typography.Text>{note}</Typography.Text>
            </Row>
          )}
        </div>
      ) : ideaDestination === IdeaDestination.MyIdeas ? (
        // this is the hoverd card inside the project page (My ideas tab)
        <MyIdeas
          entity={entity!}
          onCardHover={onCardHover}
          postIdeaOperation={postIdeaOperation}
          setNote={setNote}
          note={note}
          project={project}
          setSelectedIdeaId={setSelectedIdeaId}
          selectedIdeaId={selectedIdeaId}
        />
      ) : IdeaDestination.IdeasFromManzil === ideaDestination ? (
        // this is the hoverd card inside the project page (ideas from Manzilik tab)
        <IdeasFromManzil
          entity={entity!}
          onCardHover={onCardHover}
          onAddIdeaToProject={onAddIdeaToProject!}
          isIdeaSelected={isIdeaSelected!}
          project={project}
        />
      ) : (
        // this is the hoverd card inside the search page
        <SearchedIdea
          entity={entity!}
          onCardHover={onCardHover}
          onSendIdea={onSendIdea!}
          client={entity?.client!}
          tag={tag!}
          project={entity?.project!}
        />
      )}
      {
        // this section is related to the card in search page
        IdeaDestination.searchIdeas === ideaDestination && (
          <div className="filtered-idea-details">
            <Typography.Text className="title">{getEntityTitle(entity!, project!)}</Typography.Text>
            {entity?.client && (
              <p onClick={() => getClientProfile(history, entity?.client!)}>
                <Typography.Text className="owner">
                  <strong>{t(BY)} &nbsp;</strong>
                  {getUserName(entity?.client)}
                </Typography.Text>
              </p>
            )}
          </div>
        )
      }
    </div>
  );
};
