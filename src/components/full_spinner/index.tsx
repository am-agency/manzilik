import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export const FullSpinnerComponent = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div className="spinner-wrapper">
      <Spin spinning size="large" indicator={antIcon}></Spin>
    </div>
  );
};
