import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { TNotification } from '../types';
import { useNotificationsApi } from './useNotificationsApi';

interface Config {
  page_size: number;
}

const DEFAULT_CONFIG: Config = {
  page_size: 10,
};

export interface TLazyNotification {
  loaded: boolean;
  page: number;
  notification?: TNotification;
}
const createLazyNotitifications = (count: number, page = 0): TLazyNotification[] => {
  return Array.from({ length: count }).map(() => ({ loaded: false, page }));
};

export const useNotifications = ({ page_size } = DEFAULT_CONFIG) => {
  const loadedPages = useRef(new Set<number>());
  const api = useNotificationsApi();
  const [notifications, setNotifications] = useState<TLazyNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadedNotifications = useMemo(() => {
    return notifications
      .filter((notification) => notification.loaded)
      .map(({ notification }) => notification as TNotification);
  }, [notifications]);

  const unread = useMemo(() => {
    return loadedNotifications.filter((notification) => notification.unread);
  }, [notifications]);

  const setNotificationAsRead = (id: string, all?: boolean) => {
    setNotifications((pre) =>
      pre.map((item) => {
        if (item.notification) {
          const asRead = {
            ...item,
            notification: { ...item.notification, unread: all ? false : item.notification.id === id },
          };
          return asRead;
        } else {
          return item;
        }
      })
    );
  };

  const convertPageToRange = (page: number) => {
    const start = page * page_size;
    const end = start + page_size;
    return [start, end];
  };

  const loadPage = (page: number, loaded_notifications: TNotification[], total: number) => {
    if (page === 0 && loaded_notifications.length === 0) {
      // zero notifications
      return [];
    }
    const pages = Array.from({ length: Math.ceil(total / page_size) }).fill([]) as TLazyNotification[][];
    loadedPages.current.forEach((loadedPage) => {
      if (page === loadedPage) {
        pages[page] = loaded_notifications.map((notification) => ({ loaded: true, page, notification }));
      } else {
        const [start, end] = convertPageToRange(loadedPage);
        pages[loadedPage] = notifications.slice(start, end);
      }
    });
    return pages.map((page, index) => {
      if (page.length === 0) {
        return createLazyNotitifications(page_size - page.length, index);
      } else {
        return page;
      }
    });
  };

  const onLoadPage = async (page: number) => {
    if (loadedPages.current.has(page) === false) {
      loadedPages.current.add(page);
      const [offset] = convertPageToRange(page);
      try {
        const response = await api.getNotifications({ offset, limit: page_size });
        const pages = loadPage(page, response.results, response.count);
        setNotifications(page === 0 && pages.length === 0 ? [] : pages.flat());
      } catch (error) {
        console.warn('Failed to load notitifications');
        loadedPages.current.delete(page);
      }
    }
  };

  const onReadNotification = async (notification: TNotification) => {
    setNotificationAsRead(notification.id);
    return api.markNotificationAsRead({ notification_ids: notification.id });
  };

  const onOptimisticMarkAllAsRead = useCallback(() => {
    setNotificationAsRead('', true);
    return api.markNotificationAsRead({ all: true }).then(updateNotificationsCount);
  }, []);

  const updateNotificationsCount = () => {
    api.getNotificationsCount().then((result) => {
      setUnreadCount(result.total);
    });
  };

  useEffect(() => {
    if (unread && unread.length > 0) {
      updateNotificationsCount();
    }
  }, [unread]);

  return {
    onLoadPage,
    onOptimisticMarkAllAsRead,
    notifications,
    unread,
    unreadCount,
    loadedNotifications,
    onReadNotification,
  };
};
