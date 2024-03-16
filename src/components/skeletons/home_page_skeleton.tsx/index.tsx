import { Card, Col, List, Row, Skeleton, Space } from 'antd';
import React from 'react';
import icons from '../../../assets/icons';
import { Slider } from '../../../components/slider';
import Separator from '../../separator';
const serviceCardLength = 5;
const HomePageSkeleton = () => {
  return (
    <>
      <Separator vertical={20} />

      <Row justify="center" align="bottom" className="services-section">
        <Col xs={20} className="services-slider" style={{ width: '100%' }}>
          <Separator vertical={20} />
          <Row justify="space-between" style={{ width: '100%' }}>
            <Col xs={20}>
              <Skeleton active paragraph={false} title={{ width: '10%' }} />
            </Col>
            <Col xs={2} justify-end>
              <Skeleton active paragraph={false} title={{ width: '100%' }} />
            </Col>
          </Row>

          <Separator vertical={10} />

          <Slider
            slidesToScroll={{ xl: 5, lg: 3, md: 2, sm: 1 }}
            slidesToShow={{ xl: 5, lg: 3, md: 2, sm: 1 }}
            listLength={serviceCardLength}
          >
            {new Array(serviceCardLength).fill({})?.map((elm, i) => {
              return (
                <div key={i} style={{ width: '100%' }}>
                  <div style={{ marginInline: '5rem' }}>
                    <Skeleton paragraph={false} active title />
                    <Skeleton paragraph={false} active title />
                  </div>
                </div>
              );
            })}
          </Slider>
          <Separator vertical={30} />
        </Col>
      </Row>
      <Separator vertical={20} />

      <Row justify="center">
        <Col xs={20}>
          <Row justify="space-between" style={{ width: '100%' }}>
            <Col xs={4}>
              <Skeleton.Button active className="block" />
            </Col>
            <Col xs={4} justify-end>
              <Skeleton.Button active className="block" />
            </Col>
          </Row>
          <Col xs={24}>
            <Separator vertical={15} />
            <Row justify={'space-between'}>
              <Col xs={20} md={7}>
                <Card className="idea-card" cover={<Skeleton.Image className="block fit-parent no-image" />}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
              <Col xs={20} md={7}>
                <Card className="idea-card" cover={<Skeleton.Image className="block fit-parent no-image" />}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
              <Col xs={20} md={7}>
                <Card className="idea-card" cover={<Skeleton.Image className="block fit-parent no-image" />}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
            </Row>
          </Col>

          <Separator vertical={10} />
        </Col>
      </Row>
    </>
  );
};
export default HomePageSkeleton;
