import { Badge, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { headerIcons } from '../../../assets/icons/header';
import { NotificationsEmpty } from './notifications_empty';
import VirtualList from 'rc-virtual-list';
import { NotificationsAssets } from '../../../assets/icons/notifications';
import { NotificationLoading } from './notification_loading';
import { useNotifications } from './hooks/useNotifications';
import { Notification } from './notification';
import i18n from '../../../app/i18n';
import { useTranslation } from 'react-i18next';
import { MARK_ALL_AS_READ, NOTIFICATIONS } from '../../../locales/strings';
import { TNotification } from './types';

interface Props {
  isMobileView: boolean;
}

export const Notifications = ({ isMobileView }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { unread, onOptimisticMarkAllAsRead, onLoadPage, notifications, onReadNotification, unreadCount } =
    useNotifications();

  const toggle = () => {
    setOpen((open) => !open);
  };

  useEffect(() => {
    onLoadPage(0);
  }, []);

  const onRead = async (notification: TNotification) => {
    setOpen(false);
    return onReadNotification(notification);
  };

  return (
    <section
      className={`notifications-container ${i18n.language === 'ar' ? 'rtl' : 'ltr'} ${isMobileView ? 'mobile' : ''}`}
    >
      <section onClick={toggle}>
        <Badge count={unreadCount} className="badge" size="small">
          <img src={headerIcons.notification} />
        </Badge>
      </section>
      <section className={open ? '' : 'hide'}>
        <span onClick={toggle} className="backdrop"></span>
        <Card className="notifications-list">
          <header className="notifications-header">
            <Typography.Text strong>
              {t(NOTIFICATIONS)} ({unread.length})
            </Typography.Text>
            <button className="read-btn" onClick={onOptimisticMarkAllAsRead} disabled={unread.length <= 0}>
              <img src={NotificationsAssets.CHECK} alt="" />
              <span>{t(MARK_ALL_AS_READ)}</span>
            </button>
          </header>
          {notifications.length > 0 ? (
            <VirtualList data={notifications} height={300} itemHeight={130} itemKey="id">
              {({ loaded, page, notification }, i) => {
                if (!loaded) {
                  onLoadPage(page);
                  return <NotificationLoading />;
                } else {
                  return <Notification notification={notification as TNotification} onRead={onRead} />;
                }
              }}
            </VirtualList>
          ) : (
            <NotificationsEmpty />
          )}
        </Card>
      </section>
    </section>
  );
};
