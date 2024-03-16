import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EQUIPMENT_YOU_APARTMENT, JOINT_US_NOW, WE_BRING_PRACTICAL_IDEAS } from '../../../../locales/strings';
import { servicesMock } from '../../mock/services';
import { ServiceType } from '../../types';

export const ClientsLandingPageServices: FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  const [services, setServices] = useState<ServiceType[]>();

  useEffect(() => {
    setServices(servicesMock(i18n.language));
  }, [i18n.language]);

  return (
    <Row align="middle" className="services">
      <Col span={24} className="services-title">
        <h3>{t(EQUIPMENT_YOU_APARTMENT)}</h3>
        <Typography.Text>{t(WE_BRING_PRACTICAL_IDEAS)}</Typography.Text>
      </Col>
      <Col span={24} className="services-section">
        <Row align="middle" justify="center" gutter={[16, 50]}>
          {services?.map((service, index) => (
            <Col xl={6} lg={12} md={12} sm={24} xs={24} key={index} className="service-container">
              <div className="service">
                <Typography.Text>{service.text}</Typography.Text>
                <div className="service-icon">
                  <img src={service.icon} alt="service icon" />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={24} className="join-us-btn">
        <a href="#join-us">{t(JOINT_US_NOW)}</a>
      </Col>
    </Row>
  );
};
