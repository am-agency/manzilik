import React from 'react';
import { MarkNotificationAsReadOutput } from './api';
import { useNotificationRedirects } from './hooks/useNotificationRedirects';
import { TNotification } from './types';

interface Props {
  notification: TNotification;
  onRead: (notification: TNotification) => Promise<MarkNotificationAsReadOutput>;
}

export const NotificationTextContent = ({ notification, onRead }: Props) => {
  const { redirect } = useNotificationRedirects(notification.notification_payload);
  const onClick = async () => {
    await onRead(notification);
    redirect();
  };
  return (
    <span onClick={onClick} className="cursor">
      <p className="content text">{notification.body}</p>
    </span>
  );
};
