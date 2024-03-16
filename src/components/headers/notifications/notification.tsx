import React, { useCallback } from 'react';
import { Typography } from 'antd';
import { NotificationTextContent } from './notification_text_content';
import { Elapsed } from './elapsed';
import { NotificationClass } from './notification_class';
import { TNotification } from './types';
import { MarkNotificationAsReadOutput } from './api';

interface Props {
  notification: TNotification;
  onRead: (notification: TNotification) => Promise<MarkNotificationAsReadOutput>;
}

export const Notification = ({ notification, onRead }: Props) => {
  const NotificationContent = useCallback(() => {
    switch (notification.notification_class) {
      default:
        return <NotificationTextContent notification={notification} onRead={onRead} />;
    }
  }, [notification]);

  return (
    <article className={`notification ${notification.unread ? 'unread' : ''}`}>
      <header className="header">
        <section className="author">
          <NotificationClass notification={notification} />
          <Typography.Text strong className="author-name">
            {notification.sender.first_name} {notification.sender.last_name}
          </Typography.Text>
        </section>
        <Elapsed dateString={notification.created_at} />
      </header>
      <NotificationContent />
    </article>
  );
};
