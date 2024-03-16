import { Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Magazine } from '../../../../../API';
import { magazineIcons } from '../../../../../assets/icons/magazine';
import { BY } from '../../../../../locales/strings';
import { getUserName } from '../../../../../utils';
import { getArticleWithCommentsPath, getAutherProfile } from '../../../utils';

interface Props {
  magazine: Magazine;
}
export const AuthorSection = ({ magazine }: Props) => {
  const { t } = useTranslation();

  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Typography.Text className="by-text">{t(BY)}</Typography.Text>
        <Divider type="vertical" />
        <Link to={getAutherProfile(magazine.client!)}>
          <Typography.Text className="magazine-author">{getUserName(magazine.client)}</Typography.Text>
        </Link>
      </Col>
      <Col>
        <Link to={getArticleWithCommentsPath(magazine)}>
          <Row align="middle" justify="space-between" className="comment-wrapper">
            <div className="comment-icon">
              <img src={magazineIcons.chat} />
            </div>
            <Typography.Text className="comments-count">{magazine.comments_count}</Typography.Text>
          </Row>
        </Link>
      </Col>
    </Row>
  );
};
