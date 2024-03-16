import React from 'react';
import { notification } from 'antd';

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message: string, description: string, className?: string, style?: React.CSSProperties) => {
    api.open({
      message,
      description,
      className: className || '',
      style: style || {},
    });
  };

  return { contextHolder, openNotification };
};
