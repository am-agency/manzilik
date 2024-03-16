import React, { FunctionComponent, ReactNode } from 'react';
import { Alert, Col } from 'antd';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';

import { getLayoutDirection } from '.';
import LoginHeader from '../../components/headers/login_header';

interface Props {
  children: ReactNode;
}

export const LoginLayout: FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  // @TODO: We need to make the error from the global store.
  const [error, setError] = React.useState<{ message: string }>();
  const [loading, setLoading] = React.useState(false);
  const { i18n } = useTranslation();

  return (
    <ConfigProvider direction={getLayoutDirection(i18n.language)}>
      <Header className="home-header">
        <LoginHeader />
      </Header>
      {error && !loading && <Alert closable message={error?.message || error} type="error"></Alert>}
      <Content className="login-page-main-container">
        <Col span={24}>{children}</Col>
      </Content>
      <Footer className="login-footer">© 2021 Manzilik Co.</Footer>
    </ConfigProvider>
  );
};
