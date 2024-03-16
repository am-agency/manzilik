import React from 'react';
import { Button, Card, Col, Row, Typography } from 'antd';
import { Client } from '../../API';
import { useTranslation } from 'react-i18next';
import icons from '../../assets/icons';
import { useHistory } from 'react-router';
import { SAVE, SEND_EMAIL } from '../../locales/strings';
import { ideaIcons } from '../../assets/icons/idea';
import { ModalTitle } from '../modal_title';
import { SaveIdeaForm } from '../../pages/idea/forms/save_idea';
import { useModal } from '../../app/providers/modal';
import { BaseEntity, EntityTags, Project } from './types';
import { getIdeaCardDirection, getModalTitle } from './utils';
import { Link } from 'react-router-dom';

interface Props {
  onCardHover: () => void;
  entity: BaseEntity;
  onSendIdea: () => void;
  client?: Client;
  tag: string;
  project?: Project;
}

export const SearchedIdea: React.FunctionComponent<Props> = ({
  entity,
  onCardHover,
  onSendIdea,
  client,
  tag,
  project,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { showModal } = useModal();

  const onSaveIdea = () => {
    showModal(
      <ModalTitle title={getModalTitle(tag, t)} icon={ideaIcons.save.icon} />,
      <SaveIdeaForm projectId={entity.project_id!} entity={entity} client={client!} tag={EntityTags.IDEA} />,
      'modal-wrapper move-idea-modal save-idea-modal',
      t(SAVE)
    );
  };

  return (
    <div onMouseLeave={onCardHover} className="idea-hover search-hover-idea">
      <div>
        <Card
          hoverable
          cover={
            <div className="image-container">
              <Link to={getIdeaCardDirection(entity!, project!, tag)}>
                <img src={entity?.photo!} alt={entity?.title!} className="rounded-border img-fit-content" />
              </Link>
              <Row className="bts-wrapper" justify="center" gutter={25}>
                <Col>
                  <Button onClick={onSaveIdea} className={`save-idea`}>
                    <img src={ideaIcons.save.icon} />
                    <Typography.Text>{t(SAVE)}</Typography.Text>
                  </Button>
                </Col>
                <Col>
                  <Button onClick={onSendIdea} className={`send-idea`}>
                    <img src={icons.email.icon} />
                    <Typography.Text>{t(SEND_EMAIL)}</Typography.Text>
                  </Button>
                </Col>
              </Row>
            </div>
          }
        />
      </div>
    </div>
  );
};
