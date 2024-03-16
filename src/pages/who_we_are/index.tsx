import React, { FunctionComponent, useEffect, useState } from 'react';
import Separator from '../../components/separator';
import { Col, Row, Typography } from 'antd';
import aboutUsSofa from '../../assets/backgrounds/about_us_sofa.png';
import { Container } from '../../components/container';
import { WhoWeAreContent } from './components/who_we_are_content';
import { AboutContent } from './components/about';
import { whoWeAreMock } from './mock';
import i18n from '../../app/i18n';
import { AboutUs } from './components/who_we_are_content/types';
import { StaticPagesBreadcrumb } from '../../components/static_breadcrumb';
import { useTranslation } from 'react-i18next';
import { ABOUT_DESCRIPTION, MANZILIK, WHO_WE_ARE } from '../../locales/strings';
import { MetaTags } from '../../components/meta_tags';

const WhoWeAre: FunctionComponent = () => {
  const [aboutContent, setAboutContent] = useState<AboutUs>();
  const { t } = useTranslation();

  const getAboutContent = () => {
    const data = whoWeAreMock(i18n.language);
    setAboutContent(data);
  };

  useEffect(() => {
    getAboutContent();
  }, [i18n.language]);

  return (
    <>
      <div className="who-we-are">
        <MetaTags title={` ${t(MANZILIK)} | ${t(WHO_WE_ARE)}`} description={t(ABOUT_DESCRIPTION)} />
        <Container>
          <Separator vertical={16} />
          <StaticPagesBreadcrumb title={t(WHO_WE_ARE)} />
        </Container>
        <Separator vertical={12} />
        <Container>
          <Row justify="center" align="middle">
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <img src={aboutUsSofa} alt="sofa" className="img-fit-content" />
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <WhoWeAreContent aboutContent={aboutContent!} />
            </Col>
          </Row>
        </Container>
      </div>
      <div className="who-we-are-footer">
        <Row gutter={[64, 64]} justify="center" align="middle">
          <Col xl={16} lg={16} md={24} sm={24} xs={24}>
            <Typography.Text>{aboutContent?.footer_content}</Typography.Text>
          </Col>
        </Row>
      </div>
      <div className="about-us-points">
        <Separator vertical={18} />
        <AboutContent aboutContent={aboutContent!} />
      </div>
    </>
  );
};

export default WhoWeAre;
