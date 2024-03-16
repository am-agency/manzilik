import React, { useState } from 'react';
import { Card, Row, Tag, Typography } from 'antd';
import { ADD_NOTE, PHOTO } from '../../locales/strings';
import DropdownPopover from '../dropdown_popover';
import noteIcon from '../../assets/icons/note.svg';
import optionsIcon from '../../assets/icons/options.svg';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/lib/input/TextArea';
import { getLayoutDirection } from '../../app/layouts';
import { addNote } from '../../pages/idea/api';
import { SingleIdeaOperations } from '../../pages/idea/idea_operations/single_idea_operations';
import { useMainContext } from '../../app/providers/main';
import { useHistory } from 'react-router';
import { BaseEntity, Project } from './types';
import { DISCUSSION, IDEA } from '../../app/settings';
import icons from '../../assets/icons';
import { getEntityTitle, getIdeaCardDirection } from './utils';
import { Link } from 'react-router-dom';
import { removeWhiteSpaces } from '../../utils';

interface Props {
  onCardHover: Function;
  entity: BaseEntity;
  postIdeaOperation?: Function;
  setNote?: Function;
  note?: string;
  project?: Project;
  setSelectedIdeaId?: Function;
  selectedIdeaId?: string;
}

export const MyIdeas: React.FunctionComponent<Props> = ({
  setNote,
  note,
  onCardHover,
  entity,
  postIdeaOperation,
  project,
  setSelectedIdeaId,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [textEditable, setTextEditable] = useState<boolean>(false);
  const history = useHistory();

  const handleOnPressEnter = () => {
    requestApi(addNote, {
      project_id: entity.project_id,
      id: entity?.entity_id,
      description: note?.trim(),
    });
  };

  const handleOnMouseLeave = () => {
    onCardHover();
    setTextEditable(false);
  };

  const onAddNoteClick = () => {
    setTextEditable(true);
  };

  return (
    <div onMouseLeave={handleOnMouseLeave} className={`idea-hover ${entity.tag === DISCUSSION ? 'discussion' : ''}`}>
      <div>
        <Card
          hoverable
          cover={
            <div className="cover-img-wrapper image-container">
              <Link to={`/${removeWhiteSpaces(getIdeaCardDirection(entity!, project!))}`}>
                <img
                  src={entity?.photo! || entity.photo_url!}
                  alt={getEntityTitle(entity!, project!)}
                  className="rounded-border img-fit-content"
                />
                <div className="thumbnail-overlay zoom-in thumbnail-overlay-gradient img-fit-content rounded-top-border"></div>
              </Link>
              {entity.tag === DISCUSSION && (
                <p className="discussion-title">
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    <img src={icons.home.icon} /> &nbsp; {entity.title}
                  </Typography.Paragraph>
                </p>
              )}
            </div>
          }
          extra={
            <>
              <div className="tag">
                <Tag>{t(entity.tag == IDEA ? PHOTO : entity.tag || PHOTO)}</Tag>
              </div>
              <DropdownPopover
                trigger={'click'}
                content={
                  <SingleIdeaOperations
                    projectId={entity.project_id!}
                    entity={entity}
                    postIdeaOperation={postIdeaOperation}
                    setSelectedIdeaId={setSelectedIdeaId}
                  />
                }
              >
                <img src={optionsIcon} />
              </DropdownPopover>
            </>
          }
        />
        <Row onClick={onAddNoteClick} key="note" className={`note ${getLayoutDirection(i18n.language)}`}>
          {textEditable || note?.trim() ? (
            <TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              value={note}
              onChange={(e) => setNote?.(e.target.value)}
              onPressEnter={handleOnPressEnter}
            />
          ) : (
            <div className="note-text">
              <img src={noteIcon} /> {t(ADD_NOTE)}
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};
