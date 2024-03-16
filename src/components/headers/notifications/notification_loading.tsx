import React from 'react';
import { Skeleton, Avatar } from 'antd';
import Meta from 'antd/lib/card/Meta';

export const NotificationLoading = () => {
  return (
    <Skeleton className="notification-loading" loading={true} avatar active>
      <Meta title="loading notification" />
    </Skeleton>
  );
};
