import React, { useMemo } from 'react';
import { Avatar } from 'antd';
import { NotificationsAssets } from '../../../assets/icons/notifications';
import { TNotification } from './types';

interface Props {
  notification: TNotification;
}

export const NotificationClass = ({ notification }: Props) => {
  const notificationIcon = useMemo(() => notification?.notification_payload?.icon, [notification]);
  return (
    <section className="class">
      <Avatar
        className="image"
        src={notification?.notification_payload?.image || NotificationsAssets.AVATAR_PLACEHOLDER}
      ></Avatar>
      {notificationIcon ? <img className="class-icon" src={notificationIcon} /> : null}
    </section>
  );
};
