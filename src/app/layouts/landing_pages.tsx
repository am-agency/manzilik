import React, { FunctionComponent, ReactNode } from 'react';
import { Col } from 'antd';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';

import { getLayoutDirection } from '.';
import LandingHeader from '../../components/headers/landing_header';
import UserFooter from '../../components/footer';
import { useMainContext } from '../providers/main';
import { useLocation } from 'react-router';

const fixedHeader = {
  position: 'fixed',
  width: '100%',
} as React.CSSProperties;

interface Props {
  children: ReactNode;
}

export const LandingPagesLayout: FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  const { i18n } = useTranslation();
  const { userState } = useMainContext();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <ConfigProvider direction={getLayoutDirection(i18n.language)}>
      <Header className="home-header landing-page-home-header" style={fixedHeader}>
        <LandingHeader />
      </Header>
      <Content className="landing-page-main-container">
        <Col span={24}>{children}</Col>
      </Content>
      <Footer>
        <UserFooter />
      </Footer>
    </ConfigProvider>
  );
};
