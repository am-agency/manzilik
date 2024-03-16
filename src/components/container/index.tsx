import { Col, Row } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Container: React.FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  return (
    <Row justify="center">
      <Col span={21}>{children}</Col>
    </Row>
  );
};
