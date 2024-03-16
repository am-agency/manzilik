import { TLazyNotification } from './hooks/useNotifications';
import { TNotification, TNotificationClass, TNotificationPage, TNotificationSection } from './types';

const Id = () => Math.random().toString();

const mockSender = () => {
  return {
    id: Id(),
    first_name: 'Mohamed',
    last_name: 'Ahmed Gomaa Osman',
    profile_image: '',
  };
};

const mockPayload = () => ({
  id: Id(),
  page: TNotificationPage.DISCUSSION,
  section: TNotificationSection.Comments,
  url: '',
  icon: '',
  image: '',
});

export const mockCommentNotification = (unread = true): TNotification => ({
  id: Id(),
  title: 'notification title',
  body: 'someone replied to your comment someone replied to your comment someone replied to your comment someone replied to your comment',
  notification_class: TNotificationClass.COMMENT,
  created_at: new Date().toString(),
  unread,
  notification_payload: mockPayload(),
  sender: mockSender(),
});

const set_time_mock = (notification: TNotification, i: number): TNotification => {
  const dt = new Date();
  dt.setMinutes(dt.getMinutes() - i);
  return { ...notification, created_at: dt.toString() };
};

export const create_notifications = (loaded: number, lazy: number, pageSize: number): TLazyNotification[] =>
  [
    Array.from({ length: loaded }).map((_, i) => ({
      loaded: true,
      page: 0,
      notification: set_time_mock(mockCommentNotification(i % 2 === 0), i),
    })),
    Array.from({ length: lazy }).map(() => ({
      loaded: false,
      page: 0,
    })),
  ]
    .flatMap((a) => a)
    .map((item, i) => ({
      ...item,
      page: Math.floor(i / pageSize),
    }));
