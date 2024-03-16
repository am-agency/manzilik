import React, { FunctionComponent, useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { Container } from '../../../../components/container';
import Separator from '../../../../components/separator';
import { aboutIcons } from '../../../../assets/icons/about';
import { AboutUs } from '../who_we_are_content/types';

interface Props {
  aboutContent: AboutUs;
}

export const AboutContent: FunctionComponent<Props> = ({ aboutContent }: Props) => {
  return (
    <Container>
      <Separator vertical={35} />
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <h3>{aboutContent?.services?.title} </h3>
          <Typography.Text>{aboutContent?.services?.description}</Typography.Text>
        </Col>
      </Row>
      <Separator vertical={21} />
      <Row gutter={[24, 24]} className="about-points">
        {aboutContent?.services &&
          aboutContent?.services?.services_content.map((elm, index) => {
            return (
              <Col xl={8} lg={8} md={12} sm={24} xs={24} key={index}>
                <div className="point-card">
                  <img src={aboutIcons.about_point.icon} alt="about point" />
                  <Separator horizontal={18} />
                  <Typography.Text>{elm} </Typography.Text>
                </div>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};
