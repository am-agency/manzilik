import React from 'react';
import { Col, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';
import icons from '../../assets/icons';

import { useTranslation } from 'react-i18next';

import { CONTACT_US, MAIN, PROFESSIONALS, TERMS_AND_CONDITIONS, WHO_WE_ARE } from '../../locales/strings';
import { WHO_WE_ARE_ROUTE, TERMS_AND_CONDITIONS_ROUTE, CONTACT_US_ROUT } from '../../utils/routes';

export const LandingMenuItems = () => {
  const { t } = useTranslation();

  const menuItems = [
    { label: MAIN, link: '/' },
    { label: WHO_WE_ARE, link: WHO_WE_ARE_ROUTE },
    { label: CONTACT_US, link: CONTACT_US_ROUT },
    { label: TERMS_AND_CONDITIONS, link: TERMS_AND_CONDITIONS_ROUTE },
  ];

  return (
    <Row className="menu-items-wrapper landing-menu-wrapper">
      <Col xl={12} lg={6} md={0} sm={0} xs={0} />
      {menuItems.map((item) => (
        <Col flex={1} key={item.label}>
          <Link to={item.link!}>
            <Typography.Text>{t(item.label)}</Typography.Text>
          </Link>
        </Col>
      ))}
    </Row>
  );
};
