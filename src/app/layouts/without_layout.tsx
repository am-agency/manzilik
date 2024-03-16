import React, { FunctionComponent, ReactNode } from 'react';
import { Col } from 'antd';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { getLayoutDirection } from '.';
import UserHeader from '../../components/headers';
import ExtendedFooter from '../../components/footer/extended_footer';

const fixedHeader = {
  position: 'fixed',
  width: '100%',
} as React.CSSProperties;

interface Props {
  children: ReactNode;
}

export const WithoutFooterLayout: FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  const { i18n } = useTranslation();

  return (
    <ConfigProvider direction={getLayoutDirection(i18n.language)}>
      <Header className="home-header" style={fixedHeader}>
        <UserHeader />
      </Header>
      <Content className="main-container">
        <Col span={24}>{children}</Col>
      </Content>
    </ConfigProvider>
  );
};
