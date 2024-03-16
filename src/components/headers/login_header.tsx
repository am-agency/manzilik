import { Row, Col } from 'antd';
import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../logo';
import { LanguageSwitch } from '../language_switch';
import { getLanguageFromStorage, saveLanguageToStorage } from '../../utils';
import { AR } from '../../locales/constants';
import { getLanguageFromURL } from './utils';

const LoginHeader: FunctionComponent = () => {
  const { i18n } = useTranslation();

  const onLanguageChange = (lng: string) => {
    saveLanguageToStorage(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const lang = getLanguageFromURL(location.search);
    onLanguageChange(lang!);
  }, []);

  return (
    <Col span={24}>
      <Row align="middle" justify="space-between">
        <Col
          xl={{ span: 2, push: 11 }}
          lg={{ span: 2, push: 11 }}
          md={{ span: 3, push: 8 }}
          xs={{ span: 8, push: 0 }}
          sm={{ span: 8, push: 0 }}
        >
          <Logo />
        </Col>

        <Col xl={2} lg={2} md={3} xs={6} sm={6}>
          <LanguageSwitch onLanguageChange={onLanguageChange} />
        </Col>
      </Row>
    </Col>
  );
};

export default LoginHeader;
