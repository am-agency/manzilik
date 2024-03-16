import React, { FunctionComponent } from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Magazine } from '../../../../../API';
import Separator from '../../../../../components/separator';
import { getArticlePath } from '../../../utils';
import { AuthorSection } from '../author_section';

interface Props {
  magazine: Magazine;
}

const MainArticle: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { magazine } = props;

  return (
    <Link to={getArticlePath(magazine)}>
      <Row gutter={24} className="main-article">
        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} className="img-wrapper">
          <img src={magazine?.photo} className="img-fit-content rounded-border" />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          <div className="content-wrapper">
            <div>
              <Separator vertical={10} />
              <Typography.Text className="card-title">{magazine?.title}</Typography.Text>
              <Separator vertical={10} />
              <Typography.Text className="card-description">{magazine.meta_description}</Typography.Text>
            </div>
            {magazine && <AuthorSection magazine={magazine} />}
          </div>
        </Col>
      </Row>
    </Link>
  );
};

export default MainArticle;
