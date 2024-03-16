import { Col, Row, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../app/layouts';
import { SAVED_TO } from '../../../locales/strings';
import defaultPic from '../../../assets/backgrounds/default_pic.jpg';
import { toArrayOrEmpty } from '../../idea/utils';
import { Project } from '../../../components/idea/types';
import Separator from '../../../components/separator';

interface Props {
  project?: Project;
}

export const SuccessMessage = ({ project }: Props) => {
  const { t, i18n } = useTranslation();
  const idea = toArrayOrEmpty(project?.ideas)[0];
  return (
    <Row className={'message-content ' + getLayoutDirection(i18n.language)}>
      <div>
        <img className="img-fit-content rounded-top-border project-feature-img" src={idea?.photo! || defaultPic} />
      </div>
      <Separator horizontal={8} />
      <div>
        <Typography.Text>{t(SAVED_TO)}</Typography.Text>
        <br />
        <strong>
          <Typography.Paragraph
            ellipsis={{
              rows: 3,
            }}
          >
            {project?.title}
          </Typography.Paragraph>
        </strong>
      </div>
    </Row>
  );
};
