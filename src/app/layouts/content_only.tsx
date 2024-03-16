import React, { FunctionComponent, ReactNode } from 'react';
import { Alert, Col } from 'antd';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content } from 'antd/lib/layout/layout';

import { getLayoutDirection } from '.';

interface Props {
  children: ReactNode;
}

export const ContentOnlyLayout: FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  // @TODO: We need to make the error from the global store.
  const [error, setError] = React.useState<{ message: string }>();
  const [loading, setLoading] = React.useState(false);
  const { i18n } = useTranslation();

  return (
    <ConfigProvider direction={getLayoutDirection(i18n.language)}>
      <Content>
        <Col span={24}>{children}</Col>
      </Content>
    </ConfigProvider>
  );
};
