import React, { FunctionComponent, ReactNode } from 'react';
import { Col, Row } from 'antd';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout';
import { getLayoutDirection } from '.';

interface Props {
  children: ReactNode;
}

export const RightSidebarLayout: FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  const { i18n } = useTranslation();

  return (
    <ConfigProvider direction={getLayoutDirection(i18n.language)}>
      <Layout>
        <Header className="home-header">Header Content</Header>
        <Content className="main-container">
          <Row>
            <Col span={18}>{children}</Col>
            <Col span={6}>
              <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
              </ul>
            </Col>
          </Row>
        </Content>
        <Footer>
          <div>Footer</div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default RightSidebarLayout;
