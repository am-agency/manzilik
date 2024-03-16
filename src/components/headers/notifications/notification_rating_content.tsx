import React from 'react';
import { TNotification } from './types';

interface Props {
  notification: TNotification;
}

export const NotificationRatingContent = ({ notification }: Props) => {
  return (
    <a href="/">
      <p className="content text">{notification.body}</p>
    </a>
  );
};
