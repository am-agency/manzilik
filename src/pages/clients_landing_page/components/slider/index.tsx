import React, { FunctionComponent } from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Slider } from '../../../../components/slider';
import { landingPageImages } from '../../../../assets/images/landing_page';
import { MANY_NEW_DECORATING_IDEAS } from '../../../../locales/strings';

export const ClientsLandingPageSlider: FunctionComponent = () => {
  const { t } = useTranslation();
  const data = [
    { photo: landingPageImages.landingPageSliderImage1 },
    { photo: landingPageImages.landingPageSliderImage2 },
    { photo: landingPageImages.landingPageSliderImage3 },
    { photo: landingPageImages.landingPageSliderImage4 },
  ];
  return (
    <Row align="middle" className="products-carousel-wrapper client-slider" gutter={[8, 8]}>
      <Col xl={6} lg={7} md={24} sm={24} xs={24} className={'slider-title'}>
        <Typography.Text>{t(MANY_NEW_DECORATING_IDEAS)}</Typography.Text>
      </Col>
      <Col xl={18} lg={17} md={24} sm={24} xs={24}>
        <Slider
          slidesToScroll={{ xl: 4, lg: 3, md: 2, sm: 1 }}
          slidesToShow={{ xl: 4, lg: 3, md: 2, sm: 1 }}
          listLength={data.length}
        >
          {data.map((row, index) => (
            <div className="card-custom" key={index}>
              <div>
                <img className="img-fit-content" src={row?.photo!} />
              </div>
            </div>
          ))}
        </Slider>
      </Col>
    </Row>
  );
};
