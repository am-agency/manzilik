import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Typography } from 'antd';
import featureBg from '../../../../assets/backgrounds/professionals_landing_page_bg.png';
import featureBgEn from '../../../../assets/backgrounds/professionals_landing_page_en.svg';

import { featureMock } from '../../mock/features';
import { FeatureType } from '../../types';
import {
  ARE_YOU_AN_INTERIOR_DESIGN,
  JOINT_US_NOW,
  YOUR_GOAL_IS_TO_INCREASE_CLIENT_PROJECTS,
} from '../../../../locales/strings';
import Separator from '../../../../components/separator';
import { landingPageImages } from '../../../../assets/images/landing_page';
import { AR } from '../../../../locales/constants';

export const ProfessionalsLandingFeatures: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === AR;

  const featuresBgImage = isArabic ? featureBg : featureBgEn;

  const [features, setFeatures] = useState<FeatureType[]>();

  useEffect(() => {
    setFeatures(featureMock(i18n.language));
  }, [i18n.language]);

  return (
    <>
      <Separator vertical={50} />
      {/*@TODO: this will be changed/ move to less file when less loader is fixed*/}
      <Row
        justify="center"
        className="features"
        gutter={[0, 50]}
        style={{ backgroundImage: `url(${featuresBgImage})` }}
      >
        <div className="user_image_with_gradient">
          <div className="user_image_with_gradient_container">
            <img src={landingPageImages.professionalsUserImage3} alt="user" />
          </div>
        </div>
        <div className="user-image-rounded">
          <img src={landingPageImages.professionalsUserImage4} alt="user" />
        </div>
        <div className="user-image-rounded-black">
          <img src={landingPageImages.professionalsUserImage5} alt="user" />
        </div>
        <Col xl={18} lg={20} md={24} sm={24} xs={24} className="features-images-container">
          <div className="feature_image3_container">
            <img src={landingPageImages.professionalsFeatureImage3} alt="feature" />
          </div>
          <div className="feature_image1_container">
            <img src={landingPageImages.professionalsFeatureImage1} alt="feature" />
          </div>
          <div className="manzilik-features-title">
            <h3>{t(ARE_YOU_AN_INTERIOR_DESIGN)}</h3>
            <Typography.Text>{t(YOUR_GOAL_IS_TO_INCREASE_CLIENT_PROJECTS)}</Typography.Text>
          </div>
          <div className="feature_image2_container">
            <img src={landingPageImages.professionalsFeatureImage2} alt="feature" />
          </div>
          <Separator vertical={17} />
        </Col>
        <Col span={24}>
          <Row align="middle" justify="space-between" gutter={[30, 60]}>
            {features?.map((feature, index) => (
              <Col xl={8} lg={12} md={12} sm={24} xs={24} key={index} className="feature-container">
                <div className="feature">
                  <Typography.Text>{feature.text}</Typography.Text>
                  <div className="feature-icon">
                    <img src={feature.icon} alt="feature icon" />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={24}>
          <div className="join-us-btn">
            <a href="#join-us">{t(JOINT_US_NOW)}</a>
          </div>
        </Col>
      </Row>
    </>
  );
};
